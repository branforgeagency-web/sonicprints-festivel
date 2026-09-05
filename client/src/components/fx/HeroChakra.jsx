/* ============================================================
   HeroChakra — Continuous 360° rotating golden Sudarshan Chakra
   backdrop turning smoothly at the center of the hero banner.
   ============================================================ */

import { assetUrl } from "../../utils/assetHelper.js";

export default function HeroChakra() {
  return (
    <span className="hero-chakra" aria-hidden="true">
      <span className="hero-chakra-glow" />
      <span className="hero-chakra-wheel">
        <img
          className="hero-chakra-img"
          src={assetUrl("/assets/img/golden-sudarshan-chakra.png")}
          alt=""
          width="600"
          height="600"
          loading="eager"
          decoding="async"
          draggable="false"
        />
      </span>
    </span>
  );
}
