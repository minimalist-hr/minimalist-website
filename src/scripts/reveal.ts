/**
 * Scroll reveal (plan §3.5): content below the fold fades up once as it scrolls into view
 * (Enter), and rules draw in from the left (Reveal). Styles live in src/styles/motion.css.
 *
 * Only elements that start below the viewport are held back, so nothing on screen at load
 * waits for motion. Without JavaScript, or with reduced motion, nothing is hidden. Once an
 * element has entered, its attributes are removed, so its own transitions (hover lift,
 * colour changes) apply again.
 *
 * What enters:
 * - content: each child of a `main .container`; a child holding `[data-reveal-item]`
 *   elements (cards, steps) is opened up so those items enter one by one
 * - rules: `.rule-top`, `.rule-bottom` and elements marked `data-draw` (a border rule)
 */

/** Delay between items that enter together, and the most any item waits. */
const STAGGER_MS = 60;
const MAX_DELAY_MS = 300;
/** Reveal and Enter duration (tokens.css --duration-reveal), plus a margin for cleanup. */
const DURATION_MS = 240 + 60;

type Kind = 'reveal' | 'rule';

/** What changes when an observed element enters: an element and which attribute. */
const owners = new Map<Element, { element: HTMLElement; kind: Kind }[]>();

function collectContent(parent: Element, into: HTMLElement[]): void {
  for (const child of parent.children) {
    if (!(child instanceof HTMLElement)) continue;
    if (child.hasAttribute('data-reveal-item')) into.push(child);
    else if (child.querySelector('[data-reveal-item]')) collectContent(child, into);
    else into.push(child);
  }
}

/** True when the element (or, for a bottom rule, its bottom edge) starts below the fold. */
function belowFold(element: HTMLElement, edge: 'top' | 'bottom'): boolean {
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false; // not rendered
  return rect[edge] > window.innerHeight;
}

/** An invisible marker at the bottom of a `.rule-bottom` element, observed in its place. */
function bottomSentinel(element: HTMLElement): HTMLElement {
  const sentinel = document.createElement('span');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText =
    'position:absolute;left:0;bottom:0;width:1px;height:1px;pointer-events:none';
  element.append(sentinel);
  return sentinel;
}

function finish(element: HTMLElement, kind: Kind, observed: Element): void {
  element.removeAttribute(`data-${kind}`);
  element.style.removeProperty('--reveal-delay');
  if (observed !== element) observed.remove();
}

function enter(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort(
      (a, b) =>
        a.boundingClientRect.top - b.boundingClientRect.top ||
        a.boundingClientRect.left - b.boundingClientRect.left,
    );

  visible.forEach((entry, index) => {
    const held = owners.get(entry.target);
    if (!held) return;
    observer.unobserve(entry.target);
    owners.delete(entry.target);

    const delay = Math.min(index * STAGGER_MS, MAX_DELAY_MS);
    for (const { element, kind } of held) {
      element.style.setProperty('--reveal-delay', `${delay}ms`);
      element.setAttribute(`data-${kind}`, 'in');
      window.setTimeout(() => finish(element, kind, entry.target), delay + DURATION_MS);
    }
  });
}

export function initReveal(): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(enter, { rootMargin: '0px 0px -8% 0px' });

  const hold = (element: HTMLElement, kind: Kind, observed: Element = element) => {
    element.setAttribute(`data-${kind}`, 'pending');
    owners.set(observed, [...(owners.get(observed) ?? []), { element, kind }]);
    observer.observe(observed);
  };

  const content: HTMLElement[] = [];
  document.querySelectorAll('main .container').forEach((container) => {
    // A container inside another one already enters with its parent's content.
    if (!container.parentElement?.closest('main .container')) collectContent(container, content);
  });
  for (const element of content) {
    if (belowFold(element, 'top')) hold(element, 'reveal');
  }

  document.querySelectorAll<HTMLElement>('.rule-top, [data-draw]').forEach((element) => {
    if (belowFold(element, 'top')) hold(element, 'rule');
  });
  document.querySelectorAll<HTMLElement>('.rule-bottom').forEach((element) => {
    if (belowFold(element, 'bottom')) hold(element, 'rule', bottomSentinel(element));
  });
}
