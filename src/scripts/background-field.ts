/**
 * Background field (plan §3.5, approved addition 2026-09-22): a slow topography of hairlines.
 *
 * The page sits on one drifting scalar field. Every frame the field is sampled on a coarse
 * lattice and its contour lines (marching squares) are stroked as hairlines, so what shows on
 * screen is a set of open curves that breathe and re-form — the same hairline vocabulary as the
 * rules between sections, in motion. The pointer adds a soft hill to the field, so contours
 * crowd into rings around the cursor and settle again once it moves on. Touch drags move the
 * same hill; with no pointer at all it drifts on its own.
 *
 * One canvas serves the whole site. Its intensity follows how much of the hero is still on
 * screen: full strength over the hero, and a much quieter version (fewer lines, lower contrast)
 * everywhere else, so the effect never competes with the text. Pages without a hero run at the
 * quiet level throughout.
 *
 * Canvas 2D rather than WebGL: a frame is a few thousand one-pixel line segments, not per-pixel
 * shading, so the work is the field maths (~4k samples) and one batched stroke. Canvas 2D gives
 * crisp hairlines and honest alpha with no shader compile and no context-loss handling; WebGL
 * would only pay off if the effect shaded every pixel.
 *
 * Reduced motion draws a single still frame and stops. The canvas is decorative throughout
 * (aria-hidden, pointer-events: none), so nothing is lost when it is absent.
 */

/* ---- Tuning ------------------------------------------------------------------------- */

/** Lattice spacing in CSS pixels. Smaller = smoother curves and more work per frame. */
export const CELL_SIZE_PX = 22;
export const CELL_SIZE_PX_MOBILE = 34;

/** Number of contour levels across the field's range. More = denser topography. */
export const CONTOUR_COUNT = 13;
export const CONTOUR_COUNT_MOBILE = 8;

/** Field range the contours are spread over. */
export const CONTOUR_RANGE = 1.05;

/** Multiplier on how fast the field evolves. 1 = one full breath in roughly 40 seconds. */
export const DRIFT_SPEED = 1;

/** Line intensity over the hero, and everywhere else. 0-1; scales both alpha and relief. */
export const HERO_INTENSITY = 1;
export const AMBIENT_INTENSITY = 0.34;
/** How quickly intensity eases towards its target while scrolling (per frame, 0-1). */
export const INTENSITY_EASE = 0.05;

/** Line alpha at full intensity, before the theme's own scale. */
export const LINE_ALPHA = 0.5;

/** Pointer hill: reach in CSS pixels, height in field units, and how fast it follows. */
export const POINTER_RADIUS_PX = 280;
export const POINTER_RADIUS_PX_MOBILE = 200;
export const POINTER_STRENGTH = 1.3;
export const POINTER_EASE = 0.075;
/** Share of POINTER_STRENGTH kept away from the hero. */
export const POINTER_AMBIENT_SCALE = 0.55;
/** Idle time after which the hill leaves the last pointer position and drifts on its own. */
export const POINTER_IDLE_MS = 2600;
/** Speed and inset of the autonomous drift path (inset as a fraction of the viewport). */
export const DRIFT_PATH_SPEED = 0.055;
export const DRIFT_PATH_INSET = 0.28;

/** Device pixel ratio ceiling: past this the extra pixels cost more than they show. */
export const MAX_DPR = 1.75;

/** Below this width the mobile lattice, contour count and pointer reach are used. */
export const MOBILE_MAX_WIDTH = 640;

/** Height change ignored before the canvas is re-sized (mobile browser chrome). */
const RESIZE_HEIGHT_THRESHOLD = 120;

/* ---- Field -------------------------------------------------------------------------- */

/**
 * The field: four plane waves at different angles, scales and rates, summed to roughly
 * [-1, 1]. Cheap enough to evaluate per lattice point per frame, and slow enough that it
 * never visibly repeats within a page view.
 */
function baseField(x: number, y: number, t: number): number {
  return (
    (Math.sin(x * 0.0041 + t * 0.13) +
      Math.sin(y * 0.0053 - t * 0.09) +
      Math.sin((x * 0.72 + y * 0.69) * 0.0037 + t * 0.17) +
      Math.sin((y * 0.72 - x * 0.69) * 0.0062 - t * 0.07)) *
    0.25
  );
}

/** Position of `level` between two corner values, as a fraction of the edge. */
function crossing(a: number, b: number, level: number): number {
  const span = b - a;
  return span === 0 ? 0.5 : (level - a) / span;
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
  let cell = CELL_SIZE_PX;
  let cols = 0;
  let rows = 0;
  let levels: number[] = [];
  let values = new Float32Array(0);
  let pointerRadius = POINTER_RADIUS_PX;

  /** Where the hero ends, in document pixels; 0 when the page has no hero. */
  let heroBottom = 0;

  let elapsed = 0;
  let lastFrame = 0;
  let frame = 0;
  let onScreen = true;

  let intensity = hero ? HERO_INTENSITY : AMBIENT_INTENSITY;
  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let lastPointerAt = -Infinity;

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
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const mobile = width <= MOBILE_MAX_WIDTH;

    cell = mobile ? CELL_SIZE_PX_MOBILE : CELL_SIZE_PX;
    pointerRadius = mobile ? POINTER_RADIUS_PX_MOBILE : POINTER_RADIUS_PX;
    cols = Math.ceil(width / cell);
    rows = Math.ceil(height / cell);
    values = new Float32Array((cols + 1) * (rows + 1));

    const count = mobile ? CONTOUR_COUNT_MOBILE : CONTOUR_COUNT;
    levels = Array.from(
      { length: count },
      (_, index) => -CONTOUR_RANGE + ((index + 0.5) * (2 * CONTOUR_RANGE)) / count,
    );

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 1;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';

    measureHero();
  }

  /** Intensity for the current scroll position: hero strength while the hero is on screen. */
  function targetIntensity(): number {
    if (!hero) return AMBIENT_INTENSITY;
    const remaining = (heroBottom - window.scrollY) / height;
    const share = Math.min(Math.max(remaining, 0), 1);
    return AMBIENT_INTENSITY + (HERO_INTENSITY - AMBIENT_INTENSITY) * share;
  }

  /** Moves the hill: towards the pointer while it is active, on a slow path otherwise. */
  function movePointer(delta: number): void {
    if (elapsed - lastPointerAt > POINTER_IDLE_MS) {
      const phase = elapsed * 0.001 * DRIFT_PATH_SPEED;
      const swing = 0.5 - DRIFT_PATH_INSET;
      targetX = width * (0.5 + swing * Math.sin(phase * 2.1));
      targetY = height * (0.5 + swing * Math.sin(phase * 1.3 + 1.1));
    }
    // Frame-rate independent easing, so a slow frame does not jump the hill forward.
    const ease = 1 - Math.pow(1 - POINTER_EASE, delta / 16.67);
    pointerX += (targetX - pointerX) * ease;
    pointerY += (targetY - pointerY) * ease;
  }

  function draw(): void {
    const t = elapsed * 0.001 * DRIFT_SPEED;
    const span = HERO_INTENSITY - AMBIENT_INTENSITY || 1;
    const heroShare = Math.min(Math.max((intensity - AMBIENT_INTENSITY) / span, 0), 1);
    const peak =
      POINTER_STRENGTH * (POINTER_AMBIENT_SCALE + (1 - POINTER_AMBIENT_SCALE) * heroShare);
    const falloff = -1 / (2 * pointerRadius * pointerRadius);
    const reach = pointerRadius * 3;

    // Sample the lattice, hill included.
    for (let row = 0; row <= rows; row += 1) {
      const y = row * cell;
      const dy = y - pointerY;
      const withinY = Math.abs(dy) < reach;
      const offset = row * (cols + 1);
      for (let col = 0; col <= cols; col += 1) {
        const x = col * cell;
        let value = baseField(x, y, t) * intensity;
        if (withinY) {
          const dx = x - pointerX;
          if (Math.abs(dx) < reach) value += peak * Math.exp((dx * dx + dy * dy) * falloff);
        }
        values[offset + col] = value;
      }
    }

    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;
    ctx.globalAlpha = Math.min(LINE_ALPHA * intensity * alphaScale, 1);
    ctx.beginPath();

    // Marching squares: every level of every cell goes into one batched path.
    for (let row = 0; row < rows; row += 1) {
      const top = row * (cols + 1);
      const bottom = top + cols + 1;
      const y0 = row * cell;
      const y1 = y0 + cell;
      for (let col = 0; col < cols; col += 1) {
        const tl = values[top + col] as number;
        const tr = values[top + col + 1] as number;
        const br = values[bottom + col + 1] as number;
        const bl = values[bottom + col] as number;

        const min = Math.min(tl, tr, br, bl);
        const max = Math.max(tl, tr, br, bl);
        const x0 = col * cell;
        const x1 = x0 + cell;

        for (const level of levels) {
          if (level < min || level > max) continue;

          const code =
            (tl > level ? 8 : 0) |
            (tr > level ? 4 : 0) |
            (br > level ? 2 : 0) |
            (bl > level ? 1 : 0);
          if (code === 0 || code === 15) continue;

          // Where the level crosses each edge of the cell.
          const topX = x0 + crossing(tl, tr, level) * cell;
          const rightY = y0 + crossing(tr, br, level) * cell;
          const bottomX = x0 + crossing(bl, br, level) * cell;
          const leftY = y0 + crossing(tl, bl, level) * cell;

          switch (code) {
            case 1:
            case 14:
              ctx.moveTo(x0, leftY);
              ctx.lineTo(bottomX, y1);
              break;
            case 2:
            case 13:
              ctx.moveTo(bottomX, y1);
              ctx.lineTo(x1, rightY);
              break;
            case 3:
            case 12:
              ctx.moveTo(x0, leftY);
              ctx.lineTo(x1, rightY);
              break;
            case 4:
            case 11:
              ctx.moveTo(topX, y0);
              ctx.lineTo(x1, rightY);
              break;
            case 6:
            case 9:
              ctx.moveTo(topX, y0);
              ctx.lineTo(bottomX, y1);
              break;
            case 7:
            case 8:
              ctx.moveTo(x0, leftY);
              ctx.lineTo(topX, y0);
              break;
            // Saddles: both pairs of edges are joined.
            case 5:
              ctx.moveTo(x0, leftY);
              ctx.lineTo(topX, y0);
              ctx.moveTo(bottomX, y1);
              ctx.lineTo(x1, rightY);
              break;
            case 10:
              ctx.moveTo(topX, y0);
              ctx.lineTo(x1, rightY);
              ctx.moveTo(x0, leftY);
              ctx.lineTo(bottomX, y1);
              break;
          }
        }
      }
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function tick(now: number): void {
    frame = requestAnimationFrame(tick);
    // A long gap (a paused tab, a slow frame) is clamped, so the field never jumps forward.
    const delta = Math.min(lastFrame ? now - lastFrame : 16.67, 64);
    lastFrame = now;
    elapsed += delta;

    const ease = 1 - Math.pow(1 - INTENSITY_EASE, delta / 16.67);
    intensity += (targetIntensity() - intensity) * ease;

    movePointer(delta);
    draw();
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

  /** A single still frame: the first paint, and everything under reduced motion. */
  function drawStill(): void {
    intensity = targetIntensity();
    targetX = width * 0.5;
    targetY = height * 0.45;
    pointerX = targetX;
    pointerY = targetY;
    draw();
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

  // pointermove covers mouse, pen and touch drags; with neither, the hill drifts on its own.
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
