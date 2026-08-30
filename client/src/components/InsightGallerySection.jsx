import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { AUDIENCES } from "../data/content.js";

// Transform original AUDIENCES data into topic gallery format
const AUDIENCE_TOPICS = AUDIENCES.map((aud, audIdx) => ({
  id: aud.title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
  name: aud.title,
  headingLine2: aud.line,
  cards: aud.bullets.map((bullet, bIdx) => {
    const labels = ["Tailored Solution", "Key Benefit", "Logistics & Delivery", "Pricing & Package"];
    return {
      label: labels[bIdx] || `Feature 0${bIdx + 1}`,
      title: bullet,
      description: bIdx === 0 
        ? aud.text 
        : `${bullet}. Built specifically for ${aud.title.toLowerCase()} to ensure a seamless festive experience.`,
      meta: `Insight 0${bIdx + 1} · ${aud.title}`
    };
  })
}));

export default function InsightGallerySection({
  brandName = "SONIC PRINTS",
  eyebrowText = "BUILT FOR SIX KINDS OF BUYERS",
  headingLine1 = "Tell Us Who You Are",
  ctaText = "Request Quote & Rate Card",
  ctaHref = "/bulk",
  topics = AUDIENCE_TOPICS,
  showNav = false
}) {
  const [activeTopicIdx, setActiveTopicIdx] = useState(0);
  const [activeCardIdx, setActiveCardIdx] = useState(1); // 2nd card active by default

  const currentTopic = useMemo(() => topics[activeTopicIdx] || topics[0], [topics, activeTopicIdx]);

  // Changing a topic replaces cards and resets active card to 2nd card (index 1)
  const handleTopicChange = useCallback((index) => {
    setActiveTopicIdx(index);
    setActiveCardIdx(1);
  }, []);

  return (
    <section className="ig-section" aria-label="Buyer Insight Gallery">
      <div className="ig-ambient-glow" aria-hidden="true" />

      <div className="ig-container">
        {/* Navigation Header */}
        {showNav && (
          <header className="ig-header">
            <a href="#top" className="ig-brand-group">
              <div className="ig-logo-mark">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="5" fill="#ffffff" />
                  <path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8Z" opacity="0.4" />
                </svg>
              </div>
              <span className="ig-brand-name">{brandName}</span>
            </a>

            <nav className="ig-header-nav" aria-label="Section navigation">
              <a href="#kits" className="ig-nav-link">Why It Works</a>
              <a href="#how" className="ig-nav-link">Method</a>
              <a href="#faq" className="ig-nav-link">Library</a>
            </nav>

            <div className="ig-header-actions">
              <button type="button" className="ig-btn-text">Sign in</button>
              {ctaHref.startsWith("/") ? (
                <Link to={ctaHref} className="ig-btn-cta">{ctaText}</Link>
              ) : (
                <a href={ctaHref} className="ig-btn-cta">{ctaText}</a>
              )}
            </div>
          </header>
        )}

        {/* Hero Section */}
        <div className="ig-hero">
          <div className="ig-eyebrow">
            <span>{eyebrowText}</span>
          </div>

          <h2 className="ig-hero-title">
            {headingLine1}
            <span className="ig-hero-title-dynamic">
              {currentTopic.headingLine2}
            </span>
          </h2>

          {/* Segment / Topic Selector */}
          <div className="ig-topic-selector-wrap">
            <div className="ig-topic-selector" role="tablist" aria-label="Buyer topics">
              {topics.map((t, idx) => {
                const isActive = idx === activeTopicIdx;
                return (
                  <button
                    key={t.id || t.name}
                    type="button"
                    className={`ig-topic-tab ${isActive ? "is-active" : ""}`}
                    onClick={() => handleTopicChange(idx)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-topic-${idx}`}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4-Card Insight Gallery */}
        <div
          className="ig-gallery-grid"
          role="tabpanel"
          id={`tabpanel-topic-${activeTopicIdx}`}
          aria-label={`${currentTopic.name} insights`}
        >
          {currentTopic.cards.map((card, idx) => {
            const isActiveCard = idx === activeCardIdx;

            return (
              <div
                key={card.title || idx}
                className={`ig-card ${isActiveCard ? "is-active" : ""}`}
                onClick={() => setActiveCardIdx(idx)}
                onMouseEnter={() => setActiveCardIdx(idx)}
                onFocus={() => setActiveCardIdx(idx)}
                tabIndex={0}
                role="article"
                aria-label={card.title}
              >
                {/* Pure CSS Abstract Radial Gradient Background for Active Card */}
                <div className="ig-card-bg-abstract" aria-hidden="true" />

                {/* Card Content */}
                <div className="ig-card-content">
                  <div className="ig-card-top">
                    <span className="ig-card-label">{card.label}</span>
                    <h3 className="ig-card-title">{card.title}</h3>
                    <p className="ig-card-description">{card.description}</p>
                  </div>

                  <div className="ig-card-footer">
                    <span className="ig-card-meta">{card.meta}</span>
                    <div className="ig-card-icon-link" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </div>
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
