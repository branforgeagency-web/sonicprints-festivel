import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { assetUrl } from "../utils/assetHelper.js";

const DEFAULT_PANELS = [
  {
    id: "personal",
    title: "Personal",
    description: "The all-in-one plan for banking, saving, investing, and travel. Move freely between countries and currencies.",
    img: "/assets/img/cartoon-ganesha-mouse-bg.jpg",
    overlayClass: "fa-overlay-personal"
  },
  {
    id: "business",
    title: "Business",
    description: "Accounts, company cards, expenses, invoices, and cash-flow tools built to keep a growing business moving.",
    img: "/assets/img/display-kids.jpg",
    overlayClass: "fa-overlay-business"
  },
  {
    id: "freelance",
    title: "Freelance",
    description: "Simple payments, tax pockets, international transfers, and smart money tools for independent work.",
    img: "/assets/img/display-main.jpg",
    overlayClass: "fa-overlay-freelance"
  }
];

const DEFAULT_AVATARS = [
  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120",
  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120",
  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120"
];

export default function FinancialHeroAccordion({
  brandName = "Northstar",
  eyebrowText = "DIGITAL BANKING",
  headlineLine1 = "Discover the ",
  underlineWord = "freedom",
  headlineLine2 = " of banking on your terms.",
  description = "Get business banking, cards, bill pay, travel, and reimbursements — all in one scalable solution.",
  ctaText = "Get Demo Account",
  ctaHref = "#demo",
  panels = DEFAULT_PANELS,
  avatars = DEFAULT_AVATARS,
  showNav = true
}) {
  const [expandedIdx, setExpandedIdx] = useState(0);

  const handleNextPanel = useCallback((e) => {
    e.stopPropagation();
    setExpandedIdx((prev) => (prev + 1) % panels.length);
  }, [panels.length]);

  return (
    <section className="fa-hero-section" aria-label="Financial Services Hero">
      <div className="fa-container">
        {/* Compact Navigation Header */}
        {showNav && (
          <header className="fa-header">
            <a href="#top" className="fa-brand">
              <div className="fa-logo-dots">
                <span className="fa-logo-dot" />
                <span className="fa-logo-dot" />
                <span className="fa-logo-dot" />
                <span className="fa-logo-dot" />
              </div>
              <span className="fa-brand-title">{brandName}</span>
            </a>

            <nav className="fa-nav-center" aria-label="Main navigation">
              <span className="fa-nav-item">
                Accounts
                <svg className="fa-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
              <span className="fa-nav-item">
                Solutions
                <svg className="fa-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
              </span>
              <a href="#about" className="fa-nav-item">About us</a>
              <a href="#blog" className="fa-nav-item">Blog</a>
            </nav>

            <div className="fa-header-right">
              <button type="button" className="fa-icon-btn" aria-label="User Account">
                <svg viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              {ctaHref.startsWith("/") ? (
                <Link to={ctaHref} className="fa-btn-demo-outline">Get Demo</Link>
              ) : (
                <a href={ctaHref} className="fa-btn-demo-outline">Get Demo</a>
              )}
            </div>
          </header>
        )}

        {/* Hero Introduction (Two Columns) */}
        <div className="fa-hero-intro">
          <div className="fa-hero-left">
            <span className="fa-eyebrow">{eyebrowText}</span>
            <h1 className="fa-headline">
              {headlineLine1}
              <span className="fa-underline-wrap">
                {underlineWord}
                <svg className="fa-underline-svg" viewBox="0 0 160 12">
                  <path className="fa-underline-path" d="M3 8 Q 80 1, 157 8" />
                </svg>
              </span>
              {headlineLine2}
            </h1>
          </div>

          <div className="fa-hero-right">
            <p className="fa-hero-desc">{description}</p>
            {ctaHref.startsWith("/") ? (
              <Link to={ctaHref} className="fa-cta-pill">
                <span>{ctaText}</span>
                <span className="fa-cta-arrow-circle">
                  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </Link>
            ) : (
              <a href={ctaHref} className="fa-cta-pill">
                <span>{ctaText}</span>
                <span className="fa-cta-arrow-circle">
                  <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Interactive Horizontally Expandable Accordion */}
        <div className="fa-accordion-wrapper" role="tablist" aria-label="Banking solution panels">
          {panels.map((panel, idx) => {
            const isExpanded = idx === expandedIdx;

            return (
              <div
                key={panel.id || idx}
                className={`fa-panel ${isExpanded ? "is-expanded" : "is-collapsed"}`}
                onClick={() => setExpandedIdx(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpandedIdx(idx);
                  }
                }}
                tabIndex={0}
                role="tab"
                aria-selected={isExpanded}
                aria-label={`${panel.title} panel`}
              >
                {/* Full Cover Background Image */}
                <img
                  src={assetUrl(panel.img)}
                  alt={panel.title}
                  className="fa-panel-img"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />

                {/* Restrained Color Gradient Overlay */}
                <div className={`fa-panel-overlay ${panel.overlayClass || ""}`} aria-hidden="true" />

                {/* Collapsed Vertical Title */}
                <div className="fa-collapsed-label-wrap" aria-hidden={isExpanded}>
                  <span className="fa-collapsed-label">{panel.title}</span>
                </div>

                {/* Expanded Panel Content */}
                <div className="fa-expanded-content" aria-hidden={!isExpanded}>
                  <div className="fa-expanded-text-block">
                    <h2 className="fa-panel-title">{panel.title}</h2>
                    <p className="fa-panel-desc">{panel.description}</p>
                  </div>

                  <div className="fa-expanded-footer">
                    {/* Bottom-right Next Panel Arrow Button */}
                    <button
                      type="button"
                      className="fa-next-arrow-btn"
                      onClick={handleNextPanel}
                      aria-label="Next panel"
                    >
                      <svg viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
