import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* ============================================================
   Page transition
   Each route arrives with a short lift-and-settle so navigation
   reads as one continuous surface rather than a hard cut. Kept
   deliberately brief — nobody should wait on a transition.
   ============================================================ */

export default function PageTransition({ children }) {
  const location = useLocation();
  const { reduced } = useMotionProfile();

  if (reduced) return <div>{children}</div>;

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: EASE_SILK }}
    >
      {children}
    </motion.div>
  );
}
