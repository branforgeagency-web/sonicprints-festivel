import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSite, money } from "../../context/SiteContext.jsx";
import { Reveal } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Magnetic from "../../components/fx/Magnetic.jsx";
import Parallax from "../../components/fx/Parallax.jsx";
import { SectionAura } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

/* Each design ships a matching cut-out chakra disc: a transparent, perfectly
   radially-symmetric SVG so it can spin behind the idol without any wobble or
   visible seam. Falls back to the signature disc for an unknown design id. */
const DISC_DIR = "/assets/img/chakra";
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
  const [spinSpeed, setSpinSpeed] = useState("normal"); // 'slow' | 'normal' | 'fast'
  const [paused, setPaused] = useState(false);
  const { reduced } = useMotionProfile();
  const timer = useRef(null);

  const count = designs.length;
  const active = designs[index] || designs[0];

  // Auto-advance one design after another; hovering the stage or picking a
  // design by hand hands control back to the visitor for a beat.
  const restart = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    if (count < 2 || paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), CYCLE_MS);
  }, [count, paused]);

  useEffect(() => {
    restart();
    return () => timer.current && clearInterval(timer.current);
  }, [restart]);

  // Don't burn frames or skip ahead while the tab is in the background.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Warm the other discs so a switch never shows a blank frame.
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
            <div className="eyebrow light">Sonic signature innovation</div>
          </Reveal>
          <div className="sec-head" style={{ marginBottom: 20 }}>
            <SplitText as="h2" text={"Devotion\nin motion."} mode="char" stagger={0.035} shimmer={["motion."]} />
            <Reveal variant="fadeUp" delay={0.16} as="p" duration={0.75}>
              The outer frame stays perfectly still. The centre chakra turns — slowly, silently, endlessly —
              and the whole mandap comes alive behind Bappa.
            </Reveal>
          </div>

          <Reveal variant="fadeUp" delay={0.06}>
            <label
              style={{
                fontSize: 11.5,
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--gold-400)",
                fontWeight: 700
              }}
            >
              Choose a design
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
                  {d.name}
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

            <div className="spin-speed-controls">
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Rotation Speed:</span>
              {[
                { id: "slow", label: "🐢 Slow" },
                { id: "normal", label: "🔄 Devotional" },
                { id: "fast", label: "⚡ Fast" }
              ].map((s) => (
                <motion.button
                  key={s.id}
                  className={`spin-btn ${spinSpeed === s.id ? "active" : ""}`}
                  onClick={() => setSpinSpeed(s.id)}
                  whileTap={reduced ? undefined : { scale: 0.94 }}
                >
                  {s.label}
                </motion.button>
              ))}
            </div>

            <div className="pills" style={{ marginTop: 16 }}>
              {["360° rotating centre", "Concealed silent motor", "Warm LED glow", "Plug & play", "Mini · Family · Premium"].map((p, i) => (
                <motion.span
                  className="pill"
                  key={p}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_SILK }}
                >
                  {p}
                </motion.span>
              ))}
            </div>

            <div className="btnrow" style={{ margin: "20px 0 0" }}>
              <Magnetic>
                <Link to={`/kit/${chakra.slug}?design=${active.id}`} className="btn btn-gold btn-lg">
                  Explore the backdrop · from {money(chakra.price)}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/bulk" className="btn btn-ghost btn-lg">Order for a pandal</Link>
              </Magnetic>
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
              {/* still outer frame — only the centre turns */}
              <div className="chk-glow" />

              {/* the rotating centre chakra: one continuous spin, discs crossfade inside it */}
              <div className={`chk-disc chk-spin-${spinSpeed}${reduced ? " is-still" : ""}`}>
                <AnimatePresence initial={false}>
                  <motion.img
                    key={active.id}
                    className="chk-disc-img"
                    src={discFor(active.id)}
                    alt={`${active.name} rotating chakra backdrop`}
                    loading="eager"
                    draggable="false"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.85, ease: EASE_SILK }}
                  />
                </AnimatePresence>
              </div>

              {/* the design's still outer frame — carved band, ornament, LED ring */}
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
                  transition={{ duration: 0.85, ease: EASE_SILK }}
                />
              </AnimatePresence>

              {/* the idol never moves */}
              <div className="chk-vinayaka">
                <img src="/assets/img/vinayaka-transparent.png" alt="Vinayaka seated on his throne" loading="eager" draggable="false" />
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
