import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSite, imgUrl, money } from "../../context/SiteContext.jsx";
import Hero3DCarousel from "../../components/Hero3DCarousel.jsx";
import Icon from "../../components/Icon.jsx";
import { Reveal } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import { SectionAura, Petals } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

export default function KitsSection() {
  const { products, loading, error } = useSite();
  const { reduced } = useMotionProfile();

  const carouselItems = useMemo(() => {
    return (products || []).map((p, i) => ({
      id: p.id,
      title: p.name,
      category: p.subtitle || p.badge || "Festival Kit",
      img: imgUrl(p.img),
      price: money(p.price),
      slug: p.slug,
      slideNum: String(i + 1).padStart(2, "0")
    }));
  }, [products]);

  return (
    <section className="sec sec-collection sec-luxury-store" id="kits">
      <SectionAura tone="gold" />
      <Petals count={5} />
      <div className="wrap">
        {/* Luxury Centered Section Header */}
        <div className="sec-head center" style={{ marginBottom: 24 }}>
          <Reveal variant="fadeUp" duration={0.6}>
            <div className="eyebrow center">✨ The Sonic Festival Store</div>
          </Reveal>
          <SplitText
            as="h2"
            text={"Six Kits. Every Kind of Celebration."}
            shimmer={["Kits."]}
          />
          <Reveal variant="fadeUp" delay={0.18} as="p" duration={0.7}>
            One design system, six audiences — a hostel room, corporate floor, classroom, child&apos;s afternoon,
            living room, or retail counter. Crafted with 100% natural clay &amp; sealed prasadam.
          </Reveal>

          {/* Floating Bulk Banner Pill */}
          <Reveal variant="fadeUp" delay={0.24}>
            <div className="store-bulk-pill-banner">
              <span>🏢 Planning 25 to 5,000+ units for corporate or bulk gifting?</span>
              <Link to="/bulk" className="store-bulk-btn">
                Explore Slab Pricing <Icon name="arrow" size={13} />
              </Link>
            </div>
          </Reveal>
        </div>

        {loading && <p style={{ color: "var(--muted)", padding: "40px 0", textAlign: "center" }}>Loading the collection…</p>}
        {error && <p style={{ color: "var(--muted)", padding: "40px 0", textAlign: "center" }}>{error}</p>}

        {!loading && !error && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_SILK }}
          >
            <Hero3DCarousel
              items={carouselItems}
              showNav={false}
              showBg={false}
              eyebrowText=""
              headingLine1=""
              headingLine2=""
              description=""
              autoPlayInterval={2000}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
