import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { imgUrl, money } from "../../context/SiteContext.jsx";
import { KIDS_JOURNEY } from "../../data/content.js";
import { Reveal, RevealGroup, RevealItem } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Magnetic from "../../components/fx/Magnetic.jsx";
import Tilt from "../../components/fx/Tilt.jsx";
import { SectionAura, Petals } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

const STEP_ICONS = ["📖", "🎨", "✂️", "🪔", "📜"];
const STEP_COLORS = ["#f59e0b", "#ec4899", "#3b82f6", "#10b981", "#8b5cf6"];

/* Alternating entrance: the picture comes in from the left, the story
   from the right, and the journey steps count themselves in. */
export default function KidsSection() {
  const [activeStep, setActiveStep] = useState(0);
  const { reduced } = useMotionProfile();

  return (
    <section className="sec sec-kids" id="kids">
      <SectionAura tone="kids" />
      <Petals count={5} />
      <div className="wrap split">
        <Reveal variant="fromLeft" duration={0.9}>
          <Tilt max={4} className="kids-tilt">
            <div className="frame kids-frame-animated fx-sweep">
              <div className="kids-img-glow" />
              <img
                src={imgUrl("display-kids")}
                alt="Bal Ganesh and Make Your Own Ganesha kits on a retail display"
                loading="lazy"
                className="kids-img-zoom"
              />
              <motion.div
                className="kids-badge-overlay"
                animate={reduced ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span>✨ Kid Approved 🎨</span>
              </motion.div>
            </div>
          </Tilt>
        </Reveal>

        <div>
          <Reveal variant="fromRight" duration={0.8}>
            <div className="eyebrow light">For little hands. Big memories.</div>
          </Reveal>
          <div className="sec-head" style={{ marginBottom: 22 }}>
            <SplitText
              as="h2"
              text={"They won't just watch\nthe festival. They'll live it."}
              shimmer={["live"]}
            />
            <Reveal variant="fromRight" delay={0.16} as="p" duration={0.8}>
              Two kits built around a child&apos;s whole day — a story to read, a Ganesha to make and colour,
              a mini pandal to build, a puja simple enough for them to lead, and a certificate with their name on it.
            </Reveal>
          </div>

          {/* Interactive Journey Steps for Kids */}
          <RevealGroup className="journey journey-interactive" stagger={0.09} amount={0.2}>
            {KIDS_JOURNEY.map((step, i) => (
              <RevealItem
                key={step.title}
                variant="fromRight"
                className={`jstep jstep-card ${activeStep === i ? "jstep-active" : ""}`}
                onClick={() => setActiveStep(i)}
                whileHover={reduced ? undefined : { x: 8 }}
                transition={{ duration: 0.6, ease: EASE_SILK }}
                style={{ borderColor: activeStep === i ? STEP_COLORS[i] : "transparent" }}
              >
                <motion.div
                  className="n jstep-icon"
                  animate={{
                    background: activeStep === i ? STEP_COLORS[i] : "rgba(255, 255, 255, 0.15)",
                    scale: activeStep === i ? 1.08 : 1
                  }}
                  transition={{ duration: 0.35, ease: EASE_SILK }}
                >
                  <span>{STEP_ICONS[i]}</span>
                </motion.div>
                <div>
                  <h4 style={{ color: activeStep === i ? "#fbbf24" : "#fff" }}>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal variant="fadeUp" delay={0.1}>
            <div className="btnrow" style={{ margin: "26px 0 0" }}>
              <Magnetic>
                <Link to="/kit/bal-ganesh-kids-kit" className="btn btn-kids">
                  Bal Ganesh · {money(349)}
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/kit/make-your-own-ganesha" className="btn btn-ghost">
                  Make Your Own · {money(499)}
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
