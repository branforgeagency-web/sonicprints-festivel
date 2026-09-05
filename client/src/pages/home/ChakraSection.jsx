import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSite, money } from "../../context/SiteContext.jsx";
import { Reveal } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Parallax from "../../components/fx/Parallax.jsx";
import Icon from "../../components/Icon.jsx";
import { SectionAura } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";
import { assetUrl } from "../../utils/assetHelper.js";

const DISC_DIR = assetUrl("/assets/img/chakra");
const IDS = [
  "lotus-chakra",
  "temple-aura",
  "floral-mandala",
  "crescent-moon",
  "premium-circle",
  "divine-lotus"
];
const FALLBACK = "premium-circle";
const discFor = (id) => `${DISC_DIR}/${IDS.includes(id) ? id : FALLBACK}.svg`;
const frameFor = (id) => `${DISC_DIR}/${IDS.includes(id) ? id : FALLBACK}-frame.svg`;

const CYCLE_MS = 6500;

export default function ChakraSection() {
  const { productById } = useSite();
  const chakra = productById("chakra");
  const designs = chakra?.designs || [];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { reduced } = useMotionProfile();
  const timer = useRef(null);

  const count = designs.length;
  const active = designs[index] || designs[0];

  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (count < 2 || paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), CYCLE_MS);
  }, [count, paused]);

  useEffect(() => {
    restart();
    return () => timer.current && clearInterval(timer.current);
  }, [restart]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    designs.forEach((d) => {
      const img = new Image();
      img.src = discFor(d.id);
      const fimg = new Image();
      fimg.src = frameFor(d.id);
    });
  }, [designs]);

  if (!chakra || !active) return null;

  const frame = frameFor(active.id);

  const pick = (i) => {
    setIndex(i);
    restart();
  };

  return (
    <section className="sec sec-dark on-dark" id="chakra">
      <SectionAura tone="dark" mandala={false} />
      <div className="wrap chk">
        <div>
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow light">Sonic Signature Innovation</div>
          </Reveal>
          
          <div className="sec-head" style={{ marginBottom: 20 }}>
            <SplitText
              as="h2"
              text={"Architectural Mandap\nBackdrop Collection."}
              mode="char"
              stagger={0.03}
              shimmer={["Backdrop"]}
            />
            <Reveal variant="fadeUp" delay={0.16} as="p" duration={0.75}>
              Laser-cut acrylic precision, warm ambient LED illumination, and handcrafted gold leaf motifs.
              Designed to elevate every home shrine, office mandap, or grand festival pandal into a divine sanctuary.
            </Reveal>
          </div>

          <Reveal variant="fadeUp" delay={0.06}>
            <label
              style={{
                fontSize: 11.5,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "var(--gold-400)",
                fontWeight: 700
              }}
            >
              Select Signature Design
            </label>

            <div className="designs">
              {designs.map((d, i) => (
                <motion.button
                  key={d.id}
                  className={`dbtn${i === index ? " on" : ""}`}
                  onClick={() => pick(i)}
                  aria-pressed={i === index}
                  whileHover={reduced ? undefined : { y: -3 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                >
                  ✦ {d.name}
                </motion.button>
              ))}
            </div>

            <div className="dnote">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.id}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE_SILK }}
                  style={{ margin: 0 }}
                >
                  {active.note}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="chk-features-grid" style={{ marginTop: 22 }}>
              {[
                { icon: "sparkle", title: "Laser-Cut Acrylic Finish", text: "Precision-cut frame with gold leaf detailing" },
                { icon: "light", title: "Warm 3000K Ambient LED", text: "Concealed warm backlight built into the rim" },
                { icon: "zap", title: "10-Min Plug & Play Setup", text: "Pre-assembled unit with zero tools required" },
                { icon: "layers", title: "Home & Pandal Fit", text: "Designed for living rooms, offices & altars" }
              ].map((item) => (
                <div key={item.title} className="cfg-item">
                  <span className="cfg-icon">
                    <Icon name={item.icon} size={20} />
                  </span>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="btnrow" style={{ margin: "24px 0 0" }}>
              <Link to={`/kit/${chakra.slug}?design=${active.id}`} className="btn btn-gold btn-lg">
                Explore Backdrop Collection · from {money(chakra.price)}
              </Link>
              <Link to="/bulk" className="btn btn-ghost btn-lg">Order for a Pandal</Link>
            </div>
          </Reveal>
        </div>

        <Parallax speed={0.09} className="chk-stage-frame">
          <Reveal variant="zoomIn" duration={1} className="chk-stage">
            <div
              className="chk-mandap"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {/* Still ambient glow */}
              <div className="chk-glow" />

              {/* Motorized Rotating Backdrop Disc */}
              <div className="chk-disc">
                <AnimatePresence initial={false}>
                  <motion.img
                    key={active.id}
                    className="chk-disc-img"
                    src={discFor(active.id)}
                    alt={`${active.name} backdrop design`}
                    loading="eager"
                    draggable="false"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.75, ease: EASE_SILK }}
                  />
                </AnimatePresence>
              </div>

              {/* Outer Carved Frame */}
              <AnimatePresence initial={false}>
                <motion.img
                  key={`${active.id}-frame`}
                  className="chk-frame"
                  src={frame}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.75, ease: EASE_SILK }}
                />
              </AnimatePresence>

              {/* Foreground Vinayaka */}
              <div className="chk-vinayaka">
                <img src={assetUrl("/assets/img/vinayaka-transparent.png")} alt="Vinayaka seated on his throne" loading="lazy" decoding="async" draggable="false" />
              </div>

              <div className="chk-floor" />
            </div>

            <div className="chk-dots" role="tablist" aria-label="Chakra designs">
              {designs.map((d, i) => (
                <button
                  key={d.id}
                  className={`chk-dot${i === index ? " on" : ""}`}
                  onClick={() => pick(i)}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={d.name}
                />
              ))}
            </div>
          </Reveal>
        </Parallax>
      </div>
    </section>
  );
}
