import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AUDIENCES } from "../../data/content.js";
import Icon from "../../components/Icon.jsx";
import { Reveal } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import { SectionAura } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

export default function AudiencesSection() {
  const { reduced } = useMotionProfile();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeAudience = AUDIENCES[selectedIdx] || AUDIENCES[0];

  return (
    <section className="sec sec-dark on-dark sec-audience-luxe" id="audiences">
      <SectionAura tone="dark" />
      <div className="wrap">
        {/* Section Header */}
        <div className="sec-head center" style={{ marginBottom: 40 }}>
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center light">Built for six kinds of buyers</div>
          </Reveal>
          <SplitText
            as="h2"
            text={"Tell us who you are.\nWe will build the festival around you."}
            shimmer={["festival"]}
          />
          <Reveal variant="fadeUp" delay={0.18} as="p" duration={0.7}>
            Every segment gets its own kit mix, branding options, custom pricing slabs, and dedicated delivery plan.
          </Reveal>
        </div>

        {/* Dual-Pane Interactive Split Showcase */}
        <div className="aud-split-showcase">
          {/* Left Navigation Rail */}
          <div className="aud-split-nav" role="tablist" aria-label="Buyer Segments">
            {AUDIENCES.map((a, i) => (
              <button
                key={a.title}
                className={`aud-nav-item${selectedIdx === i ? " active" : ""}`}
                onClick={() => setSelectedIdx(i)}
                role="tab"
                aria-selected={selectedIdx === i}
              >
                <div className="aud-nav-icon">
                  <Icon name={a.icon} size={20} />
                </div>
                <div className="aud-nav-text">
                  <div className="aud-nav-title">{a.title}</div>
                  <div className="aud-nav-sub">{a.line}</div>
                </div>
                <div className="aud-nav-arrow">
                  <Icon name="arrow" size={14} />
                </div>
              </button>
            ))}
          </div>

          {/* Right Spotlight Preview Stage */}
          <div className="aud-split-stage">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeAudience.title}
                initial={reduced ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? false : { opacity: 0, x: -16 }}
                transition={{ duration: 0.4, ease: EASE_SILK }}
                className="aud-stage-content"
              >
                <div className="aud-stage-header">
                  <div className="aud-icon-badge">
                    <Icon name={activeAudience.icon} size={26} />
                  </div>
                  <div className="aud-stage-tags">
                    <span className="aud-tag">Tailored Package</span>
                    <span className="aud-tag aud-tag-gold">Segment {selectedIdx + 1} of 6</span>
                  </div>
                </div>

                <h3 className="aud-stage-title">{activeAudience.title}</h3>
                <div className="aud-stage-line">{activeAudience.line}</div>
                <p className="aud-stage-text">{activeAudience.text}</p>

                <div className="aud-stage-features-head">What is included in this package:</div>
                <ul className="aud-stage-bullets">
                  {activeAudience.bullets.map((b) => (
                    <li key={b} className="aud-bullet-item">
                      <span className="aud-bullet-check">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="aud-stage-footer">
                  <Link to="/bulk" className="btn btn-gold btn-lg">
                    Request Quote &amp; Rate Card <Icon name="arrow" size={16} />
                  </Link>
                  <span className="aud-stage-hint">✨ Slab pricing available from 25+ units</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
