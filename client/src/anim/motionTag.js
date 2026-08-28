import { motion } from "framer-motion";

/* Resolve the `as` prop to a motion component. Strings map straight to
   motion.div / motion.section / …; React components (react-router's Link,
   for instance) are wrapped once and cached, so we never create a new
   component type on re-render. */
const cache = new Map();

export default function motionTag(as) {
  if (!as) return motion.div;
  if (typeof as === "string") return motion[as] || motion.div;
  if (cache.has(as)) return cache.get(as);
  const created = motion.create(as);
  cache.set(as, created);
  return created;
}
