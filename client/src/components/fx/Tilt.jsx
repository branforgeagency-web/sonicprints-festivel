import { useCallback, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* ============================================================
   Tilt — a few degrees of depth on a product image
   The card leans very slightly toward the cursor and a soft
   reflection travels across the surface with it. Deliberately
   understated: 6 degrees at the corners, nothing at the centre.
   Off on touch devices and under reduced motion.
   ============================================================ */

export default function Tilt({
  children,
  max = 6,
  lift = 0,
  glare = true,
  className = "",
  innerClassName = "",
  ...rest
}) {
  const ref = useRef(null);
  const { allowTilt } = useMotionProfile();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const go = useMotionValue(0);

  const rotateX = useSpring(rx, { stiffness: 200, damping: 24, mass: 0.5 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 24, mass: 0.5 });
  const glareX = useSpring(gx, { stiffness: 160, damping: 26 });
  const glareY = useSpring(gy, { stiffness: 160, damping: 26 });
  const glareOpacity = useSpring(go, { stiffness: 160, damping: 26 });

  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,246,225,.55), rgba(255,246,225,.14) 34%, rgba(255,246,225,0) 62%)`;

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      rx.set((0.5 - py) * max * 2);
      ry.set((px - 0.5) * max * 2);
      gx.set(px * 100);
      gy.set(py * 100);
      go.set(1);
    },
    [max, rx, ry, gx, gy, go]
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
    go.set(0);
  }, [rx, ry, go]);

  if (!allowTilt) {
    return (
      <div ref={ref} className={className} {...rest}>
        <div className={innerClassName}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`fx-tilt ${className}`.trim()}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      <motion.div
        className={`fx-tilt-inner ${innerClassName}`.trim()}
        style={{ rotateX, rotateY, translateZ: lift }}
      >
        {children}
        {glare && <motion.span className="fx-tilt-glare" style={{ backgroundImage: glareBg, opacity: glareOpacity }} aria-hidden="true" />}
      </motion.div>
    </div>
  );
}
