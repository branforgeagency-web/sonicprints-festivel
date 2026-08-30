import { motion } from "framer-motion";

/* ============================================================
   HeroChakra — Detailed rotating golden Sudarshan Chakra backdrop,
   turning continuously at the center of the hero banner.
   ============================================================ */

export default function HeroChakra() {
  return (
    <span className="hero-chakra" aria-hidden="true">
      <span className="hero-chakra-glow" />
      <span className="hero-chakra-wheel">
        <motion.img
          className="hero-chakra-img"
          src="/assets/img/golden-sudarshan-chakra.png"
          alt=""
          width="600"
          height="600"
          loading="eager"
          decoding="async"
          draggable="false"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
        />
      </span>
    </span>
  );
}
