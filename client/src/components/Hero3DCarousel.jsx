import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const DEFAULT_CAROUSEL_ITEMS = [
  {
    id: "1",
    title: "Portraits",
    category: "Portraits",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=90",
    slideNum: "01"
  },
  {
    id: "2",
    title: "Editorial",
    category: "Editorial",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=90",
    slideNum: "02"
  },
  {
    id: "3",
    title: "Lifestyle",
    category: "Lifestyle",
    img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=90",
    slideNum: "03"
  },
  {
    id: "4",
    title: "Studio",
    category: "Studio",
    img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=90",
    slideNum: "04"
  },
  {
    id: "5",
    title: "Fashion",
    category: "Fashion",
    img: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90",
    slideNum: "05"
  }
];

export default function Hero3DCarousel({
  items = DEFAULT_CAROUSEL_ITEMS,
  showNav = true,
  showBg = false,
  brandName = "Frame Studio",
  brandLogo = null,
  brandActionText = "Explore gallery",
  brandActionHref = "#kits",
  eyebrowText = "AI-powered creative studio",
  headingLine1 = "Edit your",
  headingLine2 = "photos differently.",
  description = "Transform everyday images into polished, expressive visuals with a faster and more playful editing experience.",
  autoPlayInterval = 2000
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  const timerRef = useRef(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const totalCards = items.length;

  // Reset active index to middle if total cards changes
  useEffect(() => {
    setActiveIndex(Math.floor(totalCards / 2) || 0);
  }, [totalCards]);

  // Responsive screen size listener
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth <= 640);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reduced motion listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    function onChange(e) {
      setIsReducedMotion(e.matches);
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", onChange);
      return () => mediaQuery.removeEventListener("change", onChange);
    }
  }, []);

  // Slide navigation handlers
  const nextSlide = useCallback(() => {
    if (!totalCards) return;
    setActiveIndex((prev) => (prev + 1) % totalCards);
  }, [totalCards]);

  const prevSlide = useCallback(() => {
    if (!totalCards) return;
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
  }, [totalCards]);

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // 2-second Autoplay timer
  const startAutoplay = useCallback(() => {
    if (isReducedMotion || autoPlayInterval <= 0 || totalCards <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
  }, [nextSlide, autoPlayInterval, isReducedMotion, totalCards]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  // Restart timer after manual interaction
  const handleUserInteraction = (action) => {
    action();
    startAutoplay();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      handleUserInteraction(nextSlide);
    } else if (e.key === "ArrowLeft") {
      handleUserInteraction(prevSlide);
    }
  };

  // Touch and pointer drag handlers
  const handlePointerDown = (e) => {
    isDragging.current = true;
    touchStartPos.current = { x: e.clientX || e.touches?.[0]?.clientX || 0, y: e.clientY || e.touches?.[0]?.clientY || 0 };
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
    const endY = e.clientY || e.changedTouches?.[0]?.clientY || 0;
    
    const deltaX = endX - touchStartPos.current.x;
    const deltaY = endY - touchStartPos.current.y;

    // Trigger slide change only if horizontal swipe is dominant and above threshold (30px)
    if (Math.abs(deltaX) > 30 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleUserInteraction(nextSlide);
      } else {
        handleUserInteraction(prevSlide);
      }
    }
  };

  // Calculate 3D styles for each card WITHOUT ANY BLUR
  const getCardStyle = (index) => {
    if (!totalCards) return {};
    let offset = index - activeIndex;

    // Wrap around for circular 3D carousel positioning
    if (offset < -Math.floor(totalCards / 2)) offset += totalCards;
    if (offset > Math.floor(totalCards / 2)) offset -= totalCards;

    const absOffset = Math.abs(offset);

    // On mobile, hide cards beyond offset 1
    if (isMobile && absOffset > 1) {
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: `translateX(${offset > 0 ? 320 : -320}px) scale(0.5)`,
        zIndex: 0,
        filter: "none"
      };
    }

    if (offset === 0) {
      // Active center card
      return {
        transform: "translateX(0px) translateZ(0px) rotateY(0deg) scale(1)",
        opacity: 1,
        filter: "none",
        zIndex: 10,
        pointerEvents: "auto"
      };
    } else if (offset === 1) {
      // Immediately Right
      const translateX = isMobile ? 200 : 270;
      return {
        transform: `translateX(${translateX}px) translateZ(-130px) rotateY(-16deg) scale(0.86)`,
        opacity: 0.78,
        filter: "none",
        zIndex: 5,
        pointerEvents: "auto"
      };
    } else if (offset === -1) {
      // Immediately Left
      const translateX = isMobile ? -200 : -270;
      return {
        transform: `translateX(${translateX}px) translateZ(-130px) rotateY(16deg) scale(0.86)`,
        opacity: 0.78,
        filter: "none",
        zIndex: 5,
        pointerEvents: "auto"
      };
    } else if (offset === 2) {
      // Farther Right
      return {
        transform: "translateX(460px) translateZ(-260px) rotateY(-28deg) scale(0.7)",
        opacity: 0.35,
        filter: "none",
        zIndex: 1,
        pointerEvents: "auto"
      };
    } else if (offset === -2) {
      // Farther Left
      return {
        transform: "translateX(-460px) translateZ(-260px) rotateY(28deg) scale(0.7)",
        opacity: 0.35,
        filter: "none",
        zIndex: 1,
        pointerEvents: "auto"
      };
    } else {
      // Completely hidden cards
      return {
        opacity: 0,
        pointerEvents: "none",
        transform: "scale(0.5)",
        zIndex: 0,
        filter: "none"
      };
    }
  };

  return (
    <section
      className={`hero-3d-section${showBg ? " is-standalone-hero" : ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="3D Featured Gallery Hero Section"
      aria-roledescription="carousel"
    >
      {/* Layered Background Effects (Only rendered if showBg is true) */}
      {showBg && (
        <div className="hero-3d-bg" aria-hidden="true">
          <div className="hero-3d-glow-purple" />
          <div className="hero-3d-glow-blue" />
          <div className="hero-3d-grid-texture" />
          <div className="hero-3d-glow-bottom" />
        </div>
      )}

      {/* Top Navigation Row */}
      {showNav && (
        <nav className="hero-3d-nav" aria-label="Hero navigation">
          <a href="#top" className="hero-3d-brand">
            <div className="hero-3d-logo-mark">
              {brandLogo ? (
                <img src={brandLogo} alt={brandName} style={{ width: 22, height: 22, objectFit: "contain" }} />
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="7" height="7" rx="2" fill="white" />
                  <rect x="14" y="3" width="7" height="7" rx="2" fill="white" opacity="0.6" />
                  <rect x="3" y="14" width="7" height="7" rx="2" fill="white" opacity="0.6" />
                  <circle cx="17.5" cy="17.5" r="3.5" fill="white" />
                </svg>
              )}
            </div>
            <span className="hero-3d-brand-text">{brandName}</span>
          </a>

          {brandActionHref.startsWith("/") ? (
            <Link to={brandActionHref} className="hero-3d-nav-action">
              {brandActionText}
              <svg className="hero-3d-nav-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <a href={brandActionHref} className="hero-3d-nav-action">
              {brandActionText}
              <svg className="hero-3d-nav-arrow" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </nav>
      )}

      {/* Hero Center Heading Content */}
      {(eyebrowText || headingLine1 || headingLine2 || description) && (
        <div className="hero-3d-header-content">
          {eyebrowText && (
            <div className="hero-3d-eyebrow">
              <span className="hero-3d-eyebrow-dot" aria-hidden="true" />
              <span>{eyebrowText}</span>
            </div>
          )}

          {(headingLine1 || headingLine2) && (
            <h1 className="hero-3d-title">
              {headingLine1} {headingLine2 && <br />}
              {headingLine2 && <span className="hero-3d-title-gradient">{headingLine2}</span>}
            </h1>
          )}

          {description && <p className="hero-3d-description">{description}</p>}
        </div>
      )}

      {/* 3D Carousel Gallery Container */}
      <div
        className="hero-3d-carousel-wrapper"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
      >
        {/* Desktop Prev Button */}
        <button
          type="button"
          className="hero-3d-arrow-btn hero-3d-arrow-prev"
          onClick={() => handleUserInteraction(prevSlide)}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* 3D Cards Stage */}
        <div className="hero-3d-carousel-stage">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex;
            const style = getCardStyle(idx);
            const cardContent = (
              <>
                <img
                  src={item.img}
                  alt={item.title || item.category || `Gallery item ${idx + 1}`}
                  className="hero-3d-card-img"
                  loading={idx < 3 ? "eager" : "lazy"}
                  decoding="async"
                />

                {/* Dark gradient readability overlay */}
                <div className="hero-3d-card-overlay" aria-hidden="true" />

                {/* Reflective light shine streak for active card */}
                <div className="hero-3d-card-shine" aria-hidden="true" />

                {/* Card Info Details with Pinned Bottom Shop Now Button */}
                <div className="hero-3d-card-details">
                  <div className="hero-3d-card-header-row">
                    <div className="hero-3d-card-info">
                      <span className="hero-3d-card-category">
                        {item.category || "Collection"} {item.price ? ` · ${item.price}` : ""}
                      </span>
                      <h3 className="hero-3d-card-title">{item.title}</h3>
                    </div>

                    <div className="hero-3d-card-badge" aria-label={`Slide number ${item.slideNum || String(idx + 1).padStart(2, "0")}`}>
                      {item.slideNum || String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {item.slug ? (
                    <Link to={`/kit/${item.slug}`} className="hero-3d-shop-btn-bottom">
                      Shop Now →
                    </Link>
                  ) : (
                    <span className="hero-3d-shop-btn-bottom">Shop Now →</span>
                  )}
                </div>
              </>
            );

            return (
              <div
                key={item.id || idx}
                className={`hero-3d-card ${isActive ? "hero-3d-card-active" : ""}`}
                style={style}
                onClick={() => {
                  if (!isActive) handleUserInteraction(() => goToSlide(idx));
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${totalCards}: ${item.title || item.category}`}
                aria-hidden={Math.abs(idx - activeIndex) > 1 && isMobile}
              >
                {cardContent}
              </div>
            );
          })}
        </div>

        {/* Desktop Next Button */}
        <button
          type="button"
          className="hero-3d-arrow-btn hero-3d-arrow-next"
          onClick={() => handleUserInteraction(nextSlide)}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Pagination Glass Control (Desktop) */}
      <div className="hero-3d-pagination hero-3d-pagination-desktop" role="tablist" aria-label="Carousel pagination">
        {items.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`hero-3d-dot ${idx === activeIndex ? "hero-3d-dot-active" : ""}`}
            onClick={() => handleUserInteraction(() => goToSlide(idx))}
            role="tab"
            aria-selected={idx === activeIndex}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Mobile Controls Row (Prev/Next buttons flanking pagination) */}
      <div className="hero-3d-mobile-controls">
        <button
          type="button"
          className="hero-3d-mobile-arrow"
          onClick={() => handleUserInteraction(prevSlide)}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="hero-3d-pagination" role="tablist" aria-label="Mobile carousel pagination">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hero-3d-dot ${idx === activeIndex ? "hero-3d-dot-active" : ""}`}
              onClick={() => handleUserInteraction(() => goToSlide(idx))}
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="hero-3d-mobile-arrow"
          onClick={() => handleUserInteraction(nextSlide)}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
