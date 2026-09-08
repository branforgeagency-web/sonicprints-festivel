import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { KIDS_JOURNEY } from "../../data/content.js";
import { money, useSite, imgUrl } from "../../context/SiteContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { Reveal, RevealGroup } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import Icon from "../../components/Icon.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

const STEP_ICONS = ["📖", "🎁", "🎨", "✨", "🪔"];

export default function KidsSection() {
  const { reduced } = useMotionProfile();
  const { products } = useSite();
  const { cart, addToCart, setQty, removeAt } = useCart();
  const [activeStep, setActiveStep] = useState(0);

  const balGaneshPrice = products?.find((p) => p.id === "kids")?.price || 699;
  const currentStep = KIDS_JOURNEY[activeStep] || KIDS_JOURNEY[0];

  const kidsCartIndex = cart.findIndex((it) => it.id === "kids");
  const kidsCartItem = kidsCartIndex >= 0 ? cart[kidsCartIndex] : null;
  const kidsCartQty = kidsCartItem ? kidsCartItem.qty : 0;

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

        {/* Featured Kids Kit Showcase */}
        <Reveal variant="fadeUp" delay={0.2} style={{ marginTop: 48 }}>
          <div className="kids-showcase-stream">
            <div className="kids-showcase-heading">
              <span>🎁 Featured Kids Festival Activity Kit</span>
            </div>

            {/* Bal Ganesh Kit */}
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
                  <b className="kfr-price">{money(balGaneshPrice)}</b>
                  <span className="kfr-price-sub">All inclusive</span>
                </div>
                <div className="kpc-btn-group">
                  <Link to="/kit/bal-ganesh-kids-kit" className="btn btn-line btn-sm">
                    <Icon name="eye" size={15} /> View Details
                  </Link>
                  {kidsCartQty > 0 ? (
                    <div className="qty-stepper-btn" role="group" aria-label="Adjust Bal Ganesh Kit quantity in cart">
                      <button
                        type="button"
                        className="qsb-btn"
                        onClick={() => setQty(kidsCartIndex, -1)}
                        aria-label="Decrease quantity"
                        title="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="qsb-count" title="Quantity in cart">
                        {kidsCartQty} in cart
                      </span>
                      <button
                        type="button"
                        className="qsb-btn"
                        onClick={() => setQty(kidsCartIndex, 1)}
                        aria-label="Increase quantity"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => addToCart("kids", { qty: 1 })}
                      className="btn btn-gold btn-sm"
                    >
                      <Icon name="cart" size={15} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Bal Ganesh - What is inside the box (21 Items) */}
            <div className="kids-inside-box-wrapper">
              <div className="kids-inside-box-banner">
                <div className="kids-inside-banner-left">
                  <div className="eyebrow">📦 What's Inside The Box (21 Items)</div>
                  <h4>A Festival They Won't Just Watch. They'll Experience It.</h4>
                  <p>Everything carefully curated for hands-on crafting, learning, and celebration.</p>
                </div>
                <Link to="/kit/bal-ganesh-kids-kit" className="btn btn-line btn-sm">
                  Explore Full Kit <Icon name="arrow" />
                </Link>
              </div>

              {/* 6 Key Highlights Badges */}
              <div className="box-badges-row" style={{ margin: "16px 0 24px" }}>
                <span className="box-badge-pill"><span>🕉️</span> Bala Vinayak Idol</span>
                <span className="box-badge-pill"><span>📖</span> Story &amp; Activity</span>
                <span className="box-badge-pill"><span>🏷️</span> Sticker &amp; Labels</span>
                <span className="box-badge-pill"><span>🪔</span> Family Puja Guide</span>
                <span className="box-badge-pill"><span>📜</span> Certificate</span>
                <span className="box-badge-pill"><span>🌿</span> Eco-friendly</span>
              </div>

              {/* 2 Main Categories */}
              <div className="box-categories-grid">
                {/* Column 1: Build & Decorate Bappa (11 Items) */}
                <div className="box-category-card">
                  <div className="box-category-head box-category-head-orange">
                    <h3 className="box-category-title">
                      <span>🛠️</span> BUILD &amp; DECORATE BAPPA
                    </h3>
                    <span className="box-category-badge">11 Items Included</span>
                  </div>
                  <ul className="box-items-list">
                    <li className="box-item-row"><span className="box-item-num">1</span><span className="box-item-icon">🕉️</span><span className="box-item-name">Bal Ganesh Clay Idol (2.5 - 3 inch natural Clay)</span></li>
                    <li className="box-item-row"><span className="box-item-num">2</span><span className="box-item-icon">🏛️</span><span className="box-item-name">Mandap Backdrop</span></li>
                    <li className="box-item-row"><span className="box-item-num">3</span><span className="box-item-icon">🪑</span><span className="box-item-name">Mandap Base</span></li>
                    <li className="box-item-row"><span className="box-item-num">4</span><span className="box-item-icon">🌸</span><span className="box-item-name">Mini Rangoli Sticker</span></li>
                    <li className="box-item-row"><span className="box-item-num">5</span><span className="box-item-icon">🏮</span><span className="box-item-name">DIY Paper Toran</span></li>
                    <li className="box-item-row"><span className="box-item-num">6</span><span className="box-item-icon">🔴</span><span className="box-item-name">Kungumam</span></li>
                    <li className="box-item-row"><span className="box-item-num">7</span><span className="box-item-icon">🟡</span><span className="box-item-name">Turmeric</span></li>
                    <li className="box-item-row"><span className="box-item-num">8</span><span className="box-item-icon">🧵</span><span className="box-item-name">Thread</span></li>
                    <li className="box-item-row"><span className="box-item-num">9</span><span className="box-item-icon">🪡</span><span className="box-item-name">Needle</span></li>
                    <li className="box-item-row"><span className="box-item-num">10</span><span className="box-item-icon">🪔</span><span className="box-item-name">Agarbathi</span></li>
                    <li className="box-item-row"><span className="box-item-num">11</span><span className="box-item-icon">📜</span><span className="box-item-name">21 Names Of Ganesha Card</span></li>
                  </ul>
                </div>

                {/* Column 2: Learn • Create • Celebrate (10 Items) */}
                <div className="box-category-card">
                  <div className="box-category-head box-category-head-gold">
                    <h3 className="box-category-title">
                      <span>🎨</span> LEARN • CREATE • CELEBRATE
                    </h3>
                    <span className="box-category-badge">10 Items Included</span>
                  </div>
                  <ul className="box-items-list">
                    <li className="box-item-row"><span className="box-item-num">1</span><span className="box-item-icon">📖</span><span className="box-item-name">Bal Ganesh Story Book</span></li>
                    <li className="box-item-row"><span className="box-item-num">2</span><span className="box-item-icon">🪔</span><span className="box-item-name">My Little Puja Guide</span></li>
                    <li className="box-item-row"><span className="box-item-num">3</span><span className="box-item-icon">🎨</span><span className="box-item-name">Colouring &amp; Activity Book</span></li>
                    <li className="box-item-row"><span className="box-item-num">4</span><span className="box-item-icon">🖍️</span><span className="box-item-name">Colour Sketch Pen</span></li>
                    <li className="box-item-row"><span className="box-item-num">5</span><span className="box-item-icon">🖌️</span><span className="box-item-name">Colour Paint with brush</span></li>
                    <li className="box-item-row"><span className="box-item-num">6</span><span className="box-item-icon">✨</span><span className="box-item-name">Ganesh Sticker Sheet (No 1)</span></li>
                    <li className="box-item-row"><span className="box-item-num">7</span><span className="box-item-icon">✨</span><span className="box-item-name">Ganesh Sticker Sheet (No 2)</span></li>
                    <li className="box-item-row"><span className="box-item-num">8</span><span className="box-item-icon">🏷️</span><span className="box-item-name">Labels For Book &amp; Notes</span></li>
                    <li className="box-item-row"><span className="box-item-num">9</span><span className="box-item-icon">🙏</span><span className="box-item-name">Family Sankalp Card</span></li>
                    <li className="box-item-row"><span className="box-item-num">10</span><span className="box-item-icon">🏅</span><span className="box-item-name">Little Ganesha Certificate</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
