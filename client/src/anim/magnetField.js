/* ============================================================
   Magnetic field
   One shared pointermove listener for every magnetic element on
   the page, batched into a single rAF. Each subscriber gets the
   offset it should drift by — capped, so a button never moves
   far enough to be hard to click.
   ============================================================ */

const subscribers = new Set();
let listening = false;
let frame = 0;
let px = -9999;
let py = -9999;

function flush() {
  frame = 0;
  subscribers.forEach((sub) => {
    const el = sub.getElement();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = px - cx;
    const dy = py - cy;
    const radius = sub.radius + Math.max(rect.width, rect.height) / 2;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) {
      sub.onMove(0, 0, false);
      return;
    }
    const falloff = 1 - dist / radius;
    const cap = sub.cap;
    const mx = Math.max(-cap, Math.min(cap, dx * sub.strength * falloff));
    const my = Math.max(-cap, Math.min(cap, dy * sub.strength * falloff));
    sub.onMove(mx, my, true);
  });
}

function onPointerMove(e) {
  px = e.clientX;
  py = e.clientY;
  if (!frame) frame = requestAnimationFrame(flush);
}

export function subscribeMagnet(sub) {
  subscribers.add(sub);
  if (!listening) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    listening = true;
  }
  return () => {
    subscribers.delete(sub);
    if (!subscribers.size && listening) {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
      frame = 0;
      listening = false;
    }
  };
}
