import { imgUrl, imgUrlWebp } from "../../context/SiteContext.jsx";
import { STRIP_ITEMS } from "../../data/content.js";
import { ScrollCue } from "../../components/fx/Decor.jsx";
import { Reveal } from "../../components/fx/Reveal.jsx";
import HeroChakra from "../../components/fx/HeroChakra.jsx";
import FestiveParticles from "../../components/fx/FestiveParticles.jsx";

/* ============================================================
   Hero — headline laid over the banner artwork, with the chakra
   turning behind it. Below 760px the headline stacks above the
   image instead, where the artwork is too short to carry text.
   ============================================================ */

const MARKS = ["Colour", "Learn", "Pray", "Celebrate"];

export default function Hero() {
  function toCollection() {
    document.getElementById("kits")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <header className="hero" id="top">
        {/* Falling flowers animation scoped ONLY to hero banner section */}
        <FestiveParticles scoped />
        <div className="hero-stage">
          <div className="hero-banner">
            <picture>
              <source media="(max-width:700px)" srcSet={imgUrlWebp("hero-banner-mob")} type="image/webp" />
              <source media="(max-width:700px)" srcSet={imgUrl("hero-banner-mob")} />
              <source srcSet={imgUrlWebp("hero-banner")} type="image/webp" />
              <img
                src={imgUrl("hero-banner")}
                alt="Bring Home Little Bappa's Big Joy — Bal Ganesh Kids Activity Kit by Sonic Prints"
                width="1600"
                height="639"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </picture>
            <HeroChakra />
            <span className="hero-vignette" aria-hidden="true" />
          </div>

          <div className="hero-head">
            <Reveal variant="fadeUp" duration={0.6}>
              <p className="hh-script">
                Bring Home
                <span className="hh-heart" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false" role="presentation">
                    <path d="M12 21s-8-4.9-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 3.6C20 16.1 12 21 12 21z" />
                  </svg>
                </span>
              </p>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.08} duration={0.7}>
              <h1 className="hh-title">
                <span className="hh-ink">Little Bappa&rsquo;s</span>{" "}
                <span className="hh-flame">Big Joy!</span>
                <span className="sr">
                  {" "}— Sonic Prints Ganesh Festival Collection 2026: puja kits, kids activity kits,
                  instant mandaps and motorised rotating chakra backdrops
                </span>
              </h1>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.16} duration={0.7}>
              <p className="hh-sub">A Creative Ganesh Chaturthi Experience for Kids</p>
            </Reveal>

            {/* <Reveal variant="fadeUp" delay={0.24} duration={0.7}>
              <ul className="hh-marks">
                {MARKS.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="fadeUp" delay={0.3} duration={0.7}>
              <p className="hh-note">Let tradition begin with tiny hands</p>
            </Reveal> */}
          </div>
        </div>

        <div className="hero-cue">
          <ScrollCue label="Discover the collection" onClick={toCollection} />
        </div>
      </header>

      <div className="strip">
        <div className="strip-track">
          {[...STRIP_ITEMS, ...STRIP_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </>
  );
}
