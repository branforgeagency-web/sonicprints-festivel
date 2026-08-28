import { VARIANTS, REDUCED, DUR, EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";
import motionTag from "../../anim/motionTag.js";

/* ============================================================
   Reveal primitives
   Scroll-triggered entrances built on framer-motion's viewport
   observer (IntersectionObserver under the hood). Everything
   collapses to a plain fade when the visitor prefers reduced
   motion — content is never gated behind an animation.
   ============================================================ */

export function Reveal({
  as = "div",
  variant = "fadeUp",
  delay = 0,
  duration = DUR.md,
  ease = EASE_SILK,
  amount = 0.2,
  once = true,
  margin = "0px 0px -70px 0px",
  children,
  ...rest
}) {
  const { reduced } = useMotionProfile();
  const Tag = motionTag(as);
  const v = reduced ? REDUCED : VARIANTS[variant] || VARIANTS.fadeUp;

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin }}
      variants={v}
      transition={{ duration: reduced ? 0.2 : duration, delay: reduced ? 0 : delay, ease }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* A parent that hands its entrance down to RevealItem children,
   one after another. Used for card grids, icon rows, footer links. */
export function RevealGroup({
  as = "div",
  stagger = 0.11,
  delayChildren = 0.04,
  amount = 0.15,
  once = true,
  margin = "0px 0px -70px 0px",
  children,
  ...rest
}) {
  const { reduced } = useMotionProfile();
  const Tag = motionTag(as);

  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount, margin }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: reduced ? 0 : delayChildren
          }
        }
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  as = "div",
  variant = "cardIn",
  duration = DUR.md,
  ease = EASE_SILK,
  children,
  ...rest
}) {
  const { reduced } = useMotionProfile();
  const Tag = motionTag(as);
  const v = reduced ? REDUCED : VARIANTS[variant] || VARIANTS.cardIn;

  return (
    <Tag variants={v} transition={{ duration: reduced ? 0.2 : duration, ease }} {...rest}>
      {children}
    </Tag>
  );
}

export default Reveal;
