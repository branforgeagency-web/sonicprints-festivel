import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KIDS_JOURNEY } from "../../data/content.js";
import { money, useSite, imgUrl } from "../../context/SiteContext.jsx";
import { Reveal, RevealGroup } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Icon from "../../components/Icon.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

const STEP_ICONS = ["📖", "🎁", "🎨", "✨", "🪔"];

export default function KidsSection() {
  const { reduced } = useMotionProfile();
  const { addToCart } = useSite();
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = KIDS_JOURNEY[activeStep] || KIDS_JOURNEY[0];

  return (
    <section className="sec sec-kids-modern" id="kids">
      <div className="wrap">
        {/* Section Header */}
        <div className="sec-head center" style={{ marginBottom: 36 }}>
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center">🎨 For little hands. Big memories.</div>
          </Reveal>
          <SplitText
            as="h2"
            text={"A festival experience\nthey will remember forever."}
            shimmer={["experience"]}
          />
          <Reveal variant="fadeUp" delay={0.16} as="p" duration={0.75}>
            Designed to bring children closer to tradition through hands-on clay sculpting, story books, 
            and interactive festival activities.
          </Reveal>
        </div>

        {/* 5-Stage Interactive Journey Stepper Bar */}
        <Reveal variant="fadeUp" delay={0.22}>
          <div className="kids-journey-track" role="tablist" aria-label="Kids Festival Journey Steps">
            {KIDS_JOURNEY.map((step, i) => (
              <button
                key={step.title}
                className={`kids-journey-tab${activeStep === i ? " active" : ""}`}
                onClick={() => setActiveStep(i)}
                role="tab"
                aria-selected={activeStep === i}
              >
                <span className="kjt-icon">{STEP_ICONS[i]}</span>
                <span className="kjt-num">0{i + 1}</span>
                <span className="kjt-title">{step.title}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Active Stage Feature Stage Box */}
        <div className="kids-stage-showcase">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.title}
              className="kids-stage-grid"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? false : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE_SILK }}
            >
              {/* Left Column: Visual Showcase Frame */}
              <div className="kids-stage-visual">
                <div className="kids-stage-frame">
                  <img
                    src={imgUrl(currentStep.img)}
                    alt={currentStep.title}
                    loading="lazy"
                    decoding="async"
                    className="kids-stage-img"
                  />
                  <div className="kids-stage-badge">
                    <span>{currentStep.badge}</span>
                  </div>
                  <div className="kids-stage-counter">
                    Stage {activeStep + 1} of 5
                  </div>
                </div>
              </div>

              {/* Right Column: Storybook Experience Card */}
              <div className="kids-stage-card">
                <div className="ksc-header">
                  <div className="ksc-icon-circle">
                    {STEP_ICONS[activeStep]}
                  </div>
                  <div>
                    <span className="ksc-step-tag">STORYBOOK STAGE 0{activeStep + 1}</span>
                    <h3 className="ksc-title">{currentStep.title}</h3>
                  </div>
                </div>

                <p className="ksc-text">{currentStep.text}</p>

                <div className="ksc-perks-head">What your child experiences in this stage:</div>
                <div className="ksc-perks-grid">
                  <div className="ksc-perk-pill">
                    <span>🎨 Hands-on Crafting</span>
                  </div>
                  <div className="ksc-perk-pill">
                    <span>📖 Festival Story Book</span>
                  </div>
                  <div className="ksc-perk-pill">
                    <span>🌱 100% Eco Safe Clay</span>
                  </div>
                </div>

                {/* Stage Navigation Footer */}
                <div className="ksc-nav-row">
                  <button
                    className="ksc-nav-btn"
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  >
                    ← Previous Step
                  </button>
                  <button
                    className="ksc-nav-btn ksc-nav-btn-next"
                    disabled={activeStep === KIDS_JOURNEY.length - 1}
                    onClick={() => setActiveStep((prev) => Math.min(KIDS_JOURNEY.length - 1, prev + 1))}
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Featured Kids Kits Showcase (No Boxed Cards) */}
        <Reveal variant="fadeUp" delay={0.2} style={{ marginTop: 48 }}>
          <div className="kids-showcase-stream">
            <div className="kids-showcase-heading">
              <span>🎁 Featured Kids &amp; DIY Activity Kits</span>
            </div>

            {/* Product 1: Bal Ganesh */}
            <div className="kids-feature-row">
              <div className="kfr-info">
                <div className="kfr-meta">
                  <span className="kfr-tag">✨ Best for Ages 5–12</span>
                  <span className="kfr-sub">My First Ganesh Chaturthi Kit</span>
                </div>
                <h3 className="kfr-title">Bal Ganesh Kit</h3>
                <p className="kfr-text">
                  Story book, activity book, colouring pencils, stickers, school labels &amp; Little Ganesha certificate.
                </p>
                <div className="kpc-highlights">
                  <span className="kpc-pill">✦ Story Book</span>
                  <span className="kpc-pill">✦ Pencils &amp; Stickers</span>
                  <span className="kpc-pill">✦ Certificate</span>
                </div>
              </div>

              <div className="kfr-action-block">
                <div className="kfr-price-wrap">
                  <b className="kfr-price">{money(349)}</b>
                  <span className="kfr-price-sub">All inclusive</span>
                </div>
                <div className="kpc-btn-group">
                  <Link to="/kit/bal-ganesh-kids-kit" className="btn btn-line btn-sm">
                    <Icon name="eye" size={15} /> View Details
                  </Link>
                  <button
                    onClick={() => addToCart("kids", { qty: 1 })}
                    className="btn btn-gold btn-sm"
                  >
                    <Icon name="cart" size={15} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2: Make Your Own Ganesha (DIY) */}
            <div className="kids-feature-row">
              <div className="kfr-info">
                <div className="kfr-meta">
                  <span className="kfr-tag kfr-tag-diy">🎨 DIY Hands-on Craft</span>
                  <span className="kfr-sub">DIY Festival Activity Kit</span>
                </div>
                <h3 className="kfr-title">Make Your Own Ganesha</h3>
                <p className="kfr-text">
                  Natural clay, reusable food-grade mould, paints, toran, rangoli stencil &amp; guided eco visarjan.
                </p>
                <div className="kpc-highlights">
                  <span className="kpc-pill">✦ Eco Clay</span>
                  <span className="kpc-pill">✦ Reusable Mould</span>
                  <span className="kpc-pill">✦ Paints &amp; Stencil</span>
                </div>
              </div>

              <div className="kfr-action-block">
                <div className="kfr-price-wrap">
                  <b className="kfr-price">{money(499)}</b>
                  <span className="kfr-price-sub">All inclusive</span>
                </div>
                <div className="kpc-btn-group">
                  <Link to="/kit/make-your-own-ganesha" className="btn btn-line btn-sm">
                    <Icon name="eye" size={15} /> View Details
                  </Link>
                  <button
                    onClick={() => addToCart("diy", { qty: 1 })}
                    className="btn btn-gold btn-sm"
                  >
                    <Icon name="cart" size={15} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
