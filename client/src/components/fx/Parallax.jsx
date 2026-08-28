import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* ============================================================
   Parallax — depth, not spectacle
   Layers move at different speeds as the section passes through
   the viewport. Backgrounds drift slowest, product imagery
   fastest, text barely at all. Scaled down on phones and
   switched off entirely for reduced motion.

   The outer element is the measuring frame (never transformed,
   so the scroll maths can't feed back on itself); the inner one
   carries the movement.
   ============================================================ */

export default function Parallax({
  as = "div",
  speed = 0.12,
  scaleWith = 0,
  className = "",
  innerClassName = "",
  style,
  innerStyle,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const { parallaxScale } = useMotionProfile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const distance = speed * 140 * parallaxScale;
  const rawY = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(rawY, { stiffness: 90, damping: 26, mass: 0.5 });

  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1 + scaleWith * parallaxScale, 1]);
  const scale = useSpring(rawScale, { stiffness: 90, damping: 26, mass: 0.5 });

  const Inner = motion[as] || motion.div;
  const active = parallaxScale > 0;

  return (
    <div ref={ref} className={className} style={style} {...rest}>
      <Inner
        className={innerClassName}
        style={active ? { ...innerStyle, y, ...(scaleWith ? { scale } : null) } : innerStyle}
      >
        {children}
      </Inner>
    </div>
  );
}
