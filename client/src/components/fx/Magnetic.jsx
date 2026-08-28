import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { subscribeMagnet } from "../../anim/magnetField.js";
import useMotionProfile from "../../anim/useMotionProfile.js";
import { SPRING_MAGNET } from "../../anim/tokens.js";

/* ============================================================
   Magnetic — a button that leans toward the cursor
   Movement is capped at a few pixels, so the target never runs
   away from the click. A soft ripple blooms from the point of
   contact. On touch and reduced motion this is an ordinary
   wrapper that does nothing.
   ============================================================ */

let rippleId = 0;

export default function Magnetic({
  children,
  strength = 0.32,
  radius = 90,
  cap = 8,
  className = "",
  ripple = true,
  ...rest
}) {
  const ref = useRef(null);
  const { fine } = useMotionProfile();
  const [ripples, setRipples] = useState([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING_MAGNET);
  const y = useSpring(my, SPRING_MAGNET);

  useEffect(() => {
    if (!fine) return undefined;
    return subscribeMagnet({
      getElement: () => ref.current,
      strength,
      radius,
      cap,
      onMove: (dx, dy) => {
        mx.set(dx);
        my.set(dy);
      }
    });
  }, [fine, strength, radius, cap, mx, my]);

  const onPointerDown = useCallback(
    (e) => {
      if (!ripple) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const id = ++rippleId;
      setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
      setTimeout(() => setRipples((r) => r.filter((item) => item.id !== id)), 640);
    },
    [ripple]
  );

  return (
    <motion.span
      ref={ref}
      className={`fx-magnetic ${className}`.trim()}
      style={fine ? { x, y } : undefined}
      onPointerDown={onPointerDown}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span key={r.id} className="fx-ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </motion.span>
  );
}
