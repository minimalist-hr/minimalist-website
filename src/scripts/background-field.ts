/**
 * Background field (plan §3.5, approved addition 2026-09-22): an adaptive quadtree, drawn.
 *
 * The visualisation is the algorithm itself. The plane is tiled with root cells; a cell splits
 * into four while it is still large compared with its distance to a point of interest, and stops
 * when it is small enough or has hit the depth limit. The points of interest are the pointer and
 * two slowly drifting ones, so the partition is fine where the cursor is and coarse away from it,
 * and it keeps working when nobody is moving anything. Every line is axis-aligned and every cell
 * is a rectangle of the same proportion, which is the brand's geometry rather than an overlay on
 * top of it.
 *
 * Each cell fades in by growing from its own centre and leaves by collapsing back into it, over
 * the Reveal duration (240ms), so a split reads as four rectangles opening inside the one they
 * replaced. The lattice also drifts a few pixels a second, so the structure never sits still.
 *
 * One canvas serves the whole site. The hero runs deeper, brighter and more responsive to the
 * pointer; below the hero, and on pages without one, the same partition runs shallow and faint so
 * it never competes with the text.
 *
 * Canvas 2D rather than WebGL: a frame is a few hundred stroked rectangles over a tree of the same
 * order, so the work is trivial for a CPU and pixel-exact hairlines matter more than shading power.
 * WebGL would add a shader pipeline and context-loss handling to draw the same lines less crisply.
 *
 * Reduced motion draws a single settled frame and stops. The canvas is decorative throughout
 * (aria-hidden, pointer-events: none), so nothing is lost when it is absent.
 */

/* ---- Tuning ------------------------------------------------------------------------- */

/** Root cell size, in viewports. Everything below is this divided by powers of two. */
export const ROOT_SCALE = 2;

/** Depth limit, which sets the smallest cell: root size / 2^depth. */
export const MAX_DEPTH_HERO = 6;
export const MAX_DEPTH_AMBIENT = 4;
/** Depth taken off on phones, so the smallest cells stay readable and the tree stays small. */
export const MAX_DEPTH_MOBILE_OFFSET = 1;

/**
 * How eagerly a cell splits near a point of interest: it splits while
 * `cell size × detail > distance to the point`. Higher = denser, and further out.
 */
export const POINTER_DETAIL_HERO = 0.85;
export const POINTER_DETAIL_AMBIENT = 0.45;
/** The drifting points that keep the partition alive, and varied, with no pointer. */
export const DRIFT_DETAIL = 0.35;
export const DRIFT_COUNT = 3;

/** No cell is larger than this share of the viewport, so the partition never empties out.
 * Keep it loose: a tight value splits every far cell to the same depth, which reads as a grid. */
export const MAX_CELL_FRACTION = 1.1;

/** Line alpha over the hero and away from it, before the theme's own scale. */
export const LINE_ALPHA_HERO = 0.36;
export const LINE_ALPHA_AMBIENT = 0.085;
/** Alpha of the largest cells relative to the smallest; deeper cells read stronger. */
export const DEPTH_ALPHA_FLOOR = 0.7;

/** How quickly intensity eases towards its target while scrolling (per frame, 0-1). */
export const INTENSITY_EASE = 0.05;

/**
 * How long a cell takes to open (the Reveal duration, plan §3.5) and how long it takes to
 * collapse again. A cell also fades with its size rather than arriving at full strength, which
 * is what keeps a burst of small cells from snapping into place. Leaving is slower than
 * arriving, so passing the pointer over an area does not flicker.
 */
export const SPLIT_DURATION_MS = 240;
export const COLLAPSE_DURATION_MS = 420;
/**
 * Steps the fade is quantised into. Cells are stroked in one path per depth and step, so this
 * is the number of draw calls per depth, not a per-cell cost.
 */
export const FADE_STEPS = 6;

/** How fast the pointer's point of interest follows the cursor (per frame, 0-1). */
export const POINTER_EASE = 0.07;
/** Idle time after which the pointer's point leaves the cursor and drifts on its own. */
export const POINTER_IDLE_MS = 2600;

/** Lattice drift, in CSS pixels per second, and the speed of the drifting points. */
export const LATTICE_DRIFT_PX_PER_SEC = 7;
export const DRIFT_SPEED = 0.05;
/** How far the drifting points stay inside the viewport, as a fraction of it. */
export const DRIFT_INSET = 0.22;

/** Device pixel ratio ceiling: past this the extra pixels cost more than they show. */
export const MAX_DPR = 1.75;

/**
 * The viewport the detail values above are calibrated for, as the shorter side in CSS pixels.
 * The split test compares a cell with its distance to a point, which is scale-free, so on a
 * small screen every cell would sit inside every point's reach and refine to one even depth —
 * a grid. Detail is scaled by the viewport against this reference, and clamped, to hold the
 * same look from a phone to a wide display.
 */
export const DETAIL_REFERENCE_PX = 900;
export const DETAIL_SCALE_MIN = 0.5;
export const DETAIL_SCALE_MAX = 1.15;

/** Below this width the mobile depth limit applies. */
export const MOBILE_MAX_WIDTH = 640;

/** How far outside the viewport cells are still built, so they open off screen. */
const CULL_MARGIN_PX = 260;

/** Height change ignored before the canvas is re-sized (mobile browser chrome). */
const RESIZE_HEIGHT_THRESHOLD = 120;

/* ---- Helpers ------------------------------------------------------------------------ */

/** Reveal easing, cubic-bezier(.2,0,0,1) closely enough for a 240ms grow. */
function easeOut(t: number): number {
  const inverse = 1 - t;
  return 1 - inverse * inverse * inverse;
}

/** A point the partition refines around. */
interface Focus {
  x: number;
  y: number;
  /** How eagerly cells near this point split; see POINTER_DETAIL_HERO. */
  detail: number;
}

/** A cell of the partition, kept between frames so it can open and collapse. */
interface Cell {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  /** 0 → 1 while the cell exists, back to 0 once the algorithm drops it. */
  life: number;
  /** Frame this cell was last produced in. */
  seen: number;
}

/* ---- Engine ------------------------------------------------------------------------- */

interface Options {
  canvas: HTMLCanvasElement;
  /** The hero element, if this page has one. */
  hero: HTMLElement | null;
}

export function initBackgroundField({ canvas, hero }: Options): void {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const ctx = context;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let dpr = 1;
  let rootW = 0;
  let rootH = 0;
  let maxDepthHero = MAX_DEPTH_HERO;
  let maxDepthAmbient = MAX_DEPTH_AMBIENT;

  /** Where the hero ends, in document pixels; 0 when the page has no hero. */
  let heroBottom = 0;

  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let frameId = 0;
  let onScreen = true;

  /** 0 = the quiet level used below the hero and on every other page, 1 = the hero. */
  let intensity = hero ? 1 : 0;

  /** The points the partition refines around: the pointer's, then the drifting ones. */
  const pointerFocus: Focus = { x: 0, y: 0, detail: 0 };
  const driftFoci: Focus[] = Array.from({ length: DRIFT_COUNT }, () => ({ x: 0, y: 0, detail: 0 }));
  const foci: Focus[] = [pointerFocus, ...driftFoci];
  let targetX = 0;
  let targetY = 0;
  let lastPointerAt = -Infinity;

  const cells = new Map<number, Cell>();
  /** One path per depth and fade step (see FADE_STEPS), with a flag for the ones in use. */
  let paths: Path2D[] = [];
  const used: boolean[] = [];

  let lineColor = '#8a8880';
  let alphaScale = 1;

  function readTheme(): void {
    const styles = getComputedStyle(canvas);
    lineColor = styles.getPropertyValue('--field-line').trim() || lineColor;
    const scale = Number.parseFloat(styles.getPropertyValue('--field-alpha-scale'));
    alphaScale = Number.isFinite(scale) ? scale : 1;
  }

  function measureHero(): void {
    if (!hero) return;
    heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
  }

  function resize(): void {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const offset = width <= MOBILE_MAX_WIDTH ? MAX_DEPTH_MOBILE_OFFSET : 0;
    maxDepthHero = MAX_DEPTH_HERO - offset;
    maxDepthAmbient = MAX_DEPTH_AMBIENT - offset;

    rootW = width * ROOT_SCALE;
    rootH = height * ROOT_SCALE;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    ctx.lineJoin = 'miter';

    cells.clear();
    measureHero();
  }

  /** How much of the hero is still on screen: 1 at the top of the page, 0 once it is gone. */
  function targetIntensity(): number {
    if (!hero) return 0;
    const remaining = (heroBottom - window.scrollY) / height;
    return Math.min(Math.max(remaining, 0), 1);
  }

  /** Moves the points of interest: the first follows the pointer, the rest drift. */
  function moveFoci(delta: number): void {
    const scale = Math.min(
      Math.max(Math.min(width, height) / DETAIL_REFERENCE_PX, DETAIL_SCALE_MIN),
      DETAIL_SCALE_MAX,
    );
    const pointerDetail =
      (POINTER_DETAIL_AMBIENT + (POINTER_DETAIL_HERO - POINTER_DETAIL_AMBIENT) * intensity) * scale;
    const swing = 0.5 - DRIFT_INSET;
    const phase = elapsed * 0.001 * DRIFT_SPEED;

    // With no pointer for a while, its point joins the drift rather than parking in a corner.
    if (elapsed - lastPointerAt > POINTER_IDLE_MS) {
      targetX = width * (0.5 + swing * Math.sin(phase * 2.3));
      targetY = height * (0.5 + swing * Math.sin(phase * 1.7 + 0.6));
    }

    // Frame-rate independent easing, so a slow frame does not jump the point forward.
    const ease = 1 - Math.pow(1 - POINTER_EASE, delta / 16.67);
    pointerFocus.x += (targetX - pointerFocus.x) * ease;
    pointerFocus.y += (targetY - pointerFocus.y) * ease;
    pointerFocus.detail = pointerDetail;

    driftFoci.forEach((focus, order) => {
      const index = order + 1;
      const turn = phase * (0.8 + index * 0.35) + index * 2.1;
      focus.x = width * (0.5 + swing * Math.sin(turn));
      focus.y = height * (0.5 + swing * Math.cos(turn * 1.4 + index));
      focus.detail = DRIFT_DETAIL * (0.4 + 0.6 * intensity) * scale;
    });
  }

  /** Global cell identity, so a cell keeps its life as the lattice drifts under it. */
  function keyOf(depth: number, ix: number, iy: number): number {
    return depth * 4398046511104 + (iy + 1048576) * 2097152 + (ix + 1048576);
  }

  /** The algorithm: split while the cell is large next to its distance to a point. */
  function shouldSplit(x: number, y: number, w: number, h: number, maxCell: number): boolean {
    const size = w > h ? w : h;
    if (size > maxCell) return true;
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    for (const focus of foci) {
      const dx = cx - focus.x;
      const dy = cy - focus.y;
      // +1 keeps the cell under the cursor from dividing by zero.
      if (size * focus.detail > Math.sqrt(dx * dx + dy * dy) + 1) return true;
    }
    return false;
  }

  function refine(
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
    ix: number,
    iy: number,
    maxDepth: number,
    maxCell: number,
  ): void {
    // Cells well outside the viewport are never built; the margin lets the rest open off screen.
    if (
      x - CULL_MARGIN_PX > width ||
      x + w + CULL_MARGIN_PX < 0 ||
      y - CULL_MARGIN_PX > height ||
      y + h + CULL_MARGIN_PX < 0
    ) {
      return;
    }

    if (depth < maxDepth && shouldSplit(x, y, w, h, maxCell)) {
      const halfW = w * 0.5;
      const halfH = h * 0.5;
      const nextDepth = depth + 1;
      const nextX = ix * 2;
      const nextY = iy * 2;
      refine(x, y, halfW, halfH, nextDepth, nextX, nextY, maxDepth, maxCell);
      refine(x + halfW, y, halfW, halfH, nextDepth, nextX + 1, nextY, maxDepth, maxCell);
      refine(x, y + halfH, halfW, halfH, nextDepth, nextX, nextY + 1, maxDepth, maxCell);
      refine(
        x + halfW,
        y + halfH,
        halfW,
        halfH,
        nextDepth,
        nextX + 1,
        nextY + 1,
        maxDepth,
        maxCell,
      );
      return;
    }

    const key = keyOf(depth, ix, iy);
    const existing = cells.get(key);
    if (existing) {
      existing.x = x;
      existing.y = y;
      existing.w = w;
      existing.h = h;
      existing.seen = frameId;
    } else {
      cells.set(key, { x, y, w, h, depth, life: 0, seen: frameId });
    }
  }

  /** Rebuilds the partition for this frame and ages every cell in or out of it. */
  function update(delta: number): number {
    frameId += 1;

    const maxDepth = Math.round(maxDepthAmbient + (maxDepthHero - maxDepthAmbient) * intensity);
    const maxCell = Math.min(width, height) * MAX_CELL_FRACTION;

    // The lattice drifts, so the partition is never pinned to the middle of the window.
    const travel = elapsed * 0.001 * LATTICE_DRIFT_PX_PER_SEC;
    const originX = width * 0.5 - rootW * 0.5 + travel * 0.6;
    const originY = height * 0.5 - rootH * 0.5 + travel * 0.35;
    const firstX = Math.floor((0 - CULL_MARGIN_PX - originX) / rootW);
    const lastX = Math.floor((width + CULL_MARGIN_PX - originX) / rootW);
    const firstY = Math.floor((0 - CULL_MARGIN_PX - originY) / rootH);
    const lastY = Math.floor((height + CULL_MARGIN_PX - originY) / rootH);

    for (let tileY = firstY; tileY <= lastY; tileY += 1) {
      for (let tileX = firstX; tileX <= lastX; tileX += 1) {
        refine(
          originX + tileX * rootW,
          originY + tileY * rootH,
          rootW,
          rootH,
          0,
          tileX,
          tileY,
          maxDepth,
          maxCell,
        );
      }
    }

    const opening = delta / SPLIT_DURATION_MS;
    const collapsing = delta / COLLAPSE_DURATION_MS;
    for (const [key, cell] of cells) {
      if (cell.seen === frameId) {
        cell.life = Math.min(cell.life + opening, 1);
      } else {
        cell.life -= collapsing;
        if (cell.life <= 0) cells.delete(key);
      }
    }

    return maxDepth;
  }

  /** Pixel grid alignment, so every hairline lands on one device pixel. */
  function snap(value: number): number {
    return Math.round(value * dpr - 0.5) / dpr + 0.5 / dpr;
  }

  function draw(maxDepth: number): void {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;

    // One path per depth and fade step: a cell's alpha follows its life, but the strokes stay
    // batched, so the frame costs a few dozen draw calls however many cells are in flight.
    const groups = (maxDepth + 1) * FADE_STEPS;
    if (paths.length !== groups) paths = [];
    for (let group = 0; group < groups; group += 1) paths[group] = new Path2D();
    used.length = groups;
    used.fill(false);

    for (const cell of cells.values()) {
      const { x, y, w, h, life } = cell;
      const depth = Math.min(cell.depth, maxDepth);
      const step = Math.min(Math.max(Math.ceil(life * FADE_STEPS) - 1, 0), FADE_STEPS - 1);
      const group = depth * FADE_STEPS + step;
      const path = paths[group];
      if (!path) continue;
      used[group] = true;

      // Opening and collapsing are a grow from the cell's own centre.
      const scale = easeOut(life);
      const insetX = w * (1 - scale) * 0.5;
      const insetY = h * (1 - scale) * 0.5;
      const left = snap(x + insetX);
      const top = snap(y + insetY);
      path.rect(left, top, snap(x + w - insetX) - left, snap(y + h - insetY) - top);
    }

    const alpha =
      (LINE_ALPHA_AMBIENT + (LINE_ALPHA_HERO - LINE_ALPHA_AMBIENT) * intensity) * alphaScale;
    for (let depth = 0; depth <= maxDepth; depth += 1) {
      // Deeper cells are smaller and denser, so they carry the emphasis.
      const share = maxDepth === 0 ? 1 : depth / maxDepth;
      const depthAlpha = alpha * (DEPTH_ALPHA_FLOOR + (1 - DEPTH_ALPHA_FLOOR) * share);
      for (let step = 0; step < FADE_STEPS; step += 1) {
        const group = depth * FADE_STEPS + step;
        const path = paths[group];
        if (!path || !used[group]) continue;
        ctx.globalAlpha = Math.min(depthAlpha * ((step + 1) / FADE_STEPS), 1);
        ctx.stroke(path);
      }
    }
    ctx.globalAlpha = 1;
  }

  function tick(now: number): void {
    frame = requestAnimationFrame(tick);
    // A long gap (a paused tab, a slow frame) is clamped, so nothing jumps on the way back.
    const delta = Math.min(lastFrame ? now - lastFrame : 16.67, 64);
    lastFrame = now;
    elapsed += delta;

    const ease = 1 - Math.pow(1 - INTENSITY_EASE, delta / 16.67);
    intensity += (targetIntensity() - intensity) * ease;

    moveFoci(delta);
    draw(update(delta));
  }

  function start(): void {
    if (frame || reduced.matches) return;
    lastFrame = 0;
    frame = requestAnimationFrame(tick);
  }

  function stop(): void {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  /** Runs only while the canvas is on screen and the tab is visible. */
  function sync(): void {
    if (onScreen && !document.hidden) start();
    else stop();
  }

  /** A single settled frame: the first paint, and everything under reduced motion. */
  function drawStill(): void {
    intensity = targetIntensity();
    moveFoci(16.67);
    pointerFocus.x = targetX;
    pointerFocus.y = targetY;
    // A long step settles every cell at full size, with nothing mid-animation.
    draw(update(SPLIT_DURATION_MS * 2));
  }

  readTheme();
  resize();
  drawStill();

  let lastWidth = width;
  let lastHeight = height;
  window.addEventListener(
    'resize',
    () => {
      // Mobile browser chrome sliding in and out changes the height only; ignore that.
      const changed =
        window.innerWidth !== lastWidth ||
        Math.abs(window.innerHeight - lastHeight) > RESIZE_HEIGHT_THRESHOLD;
      if (!changed) return;
      lastWidth = window.innerWidth;
      lastHeight = window.innerHeight;
      resize();
      if (reduced.matches) drawStill();
    },
    { passive: true },
  );

  // The hero's height changes with the font load and with orientation.
  if (hero && 'ResizeObserver' in window) new ResizeObserver(measureHero).observe(hero);

  // pointermove covers mouse, pen and touch drags; with neither, the points drift on their own.
  window.addEventListener(
    'pointermove',
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      lastPointerAt = elapsed;
    },
    { passive: true },
  );

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      sync();
    }).observe(canvas);
  }

  document.addEventListener('visibilitychange', sync);

  // The theme toggle swaps the line colour under us.
  new MutationObserver(() => {
    readTheme();
    if (reduced.matches) drawStill();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stop();
      drawStill();
    } else {
      sync();
    }
  });

  sync();
}
