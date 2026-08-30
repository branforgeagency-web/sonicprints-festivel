import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HOW_STEPS } from "../../data/content.js";
import { Reveal } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Icon from "../../components/Icon.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

const STEP_ICONS = ["sparkle", "eye", "layers", "dealer"];

export default function HowSection() {
  const { reduced } = useMotionProfile();

  return (
    <section className="sec sec-dark on-dark sec-pipeline" id="how">
      <div className="wrap">
        <div className="sec-head center" style={{ marginBottom: 44 }}>
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center light">How a bulk order works</div>
          </Reveal>
          <SplitText as="h2" text={"Four steps. Nineteen days."} mode="word" shimmer={["Nineteen"]} />
          <Reveal variant="fadeUp" delay={0.16} as="p" duration={0.75}>
            From first call to delivered boxes — the same seamless process whether you need 25 kits or 25,000.
          </Reveal>
        </div>

        {/* Connected Flowing Process Rail */}
        <div className="process-rail-wrapper">
          <div className="process-rail-track" aria-hidden="true" />

          <div className="process-rail-grid">
            {HOW_STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                className="process-rail-step"
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE_SILK }}
                whileHover={reduced ? undefined : { y: -4 }}
              >
                {/* Flowing Step Badge & Glowing Halo Node */}
                <div className="process-rail-node">
                  <span className="process-rail-halo" />
                  <span className="process-rail-num">0{i + 1}</span>
                  <span className="process-rail-icon">
                    <Icon name={STEP_ICONS[i]} size={18} />
                  </span>
                </div>

                {/* Streamlined Step Copy (No heavy card box) */}
                <div className="process-rail-content">
                  <div className="process-rail-step-badge">Step 0{i + 1}</div>
                  <h4 className="process-rail-title">{s.title}</h4>
                  <p className="process-rail-text">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call-to-action button below pipeline */}
        <Reveal variant="fadeUp" delay={0.3} style={{ textAlign: "center", marginTop: 42 }}>
          <Link to="/bulk" className="btn btn-gold btn-lg">
            Start Your Bulk Order <Icon name="arrow" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
