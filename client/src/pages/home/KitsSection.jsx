import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "../../context/SiteContext.jsx";
import KitCard from "../../components/KitCard.jsx";
import Icon from "../../components/Icon.jsx";
import { Reveal, RevealGroup } from "../../components/fx/Reveal.jsx";
import SplitText from "../../components/fx/SplitText.jsx";
import { SectionAura, Petals } from "../../components/fx/Decor.jsx";
import { EASE_SILK } from "../../anim/tokens.js";
import useMotionProfile from "../../anim/useMotionProfile.js";

const FILTERS = [
  { id: "all", label: "✨ All Collection", count: 6 },
  { id: "puja", label: "🪔 Home & Puja", category: ["mini", "employee"] },
  { id: "kids", label: "🎨 Kids & DIY", category: ["kids", "diy"] },
  { id: "mandap", label: "🌺 Mandap & Backdrop", category: ["mandap", "chakra"] }
];

export default function KitsSection() {
  const { products, loading, error } = useSite();
  const [activeFilter, setActiveFilter] = useState("all");
  const { reduced } = useMotionProfile();

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    const currentTab = FILTERS.find((f) => f.id === activeFilter);
    if (!currentTab?.category) return products;
    return products.filter((p) => currentTab.category.includes(p.id));
  }, [products, activeFilter]);

  return (
    <section className="sec sec-collection sec-luxury-store" id="kits">
      <SectionAura tone="gold" />
      <Petals count={5} />
      <div className="wrap">
        {/* Luxury Centered Section Header */}
        <div className="sec-head center" style={{ marginBottom: 36 }}>
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

        {/* Floating Luxury Category Filter Tabs */}
        <Reveal variant="fadeUp" delay={0.28}>
          <div className="store-control-bar store-control-centered">
            <div className="kit-filter-tabs" role="tablist" aria-label="Product categories">
              {FILTERS.map((tab) => (
                <button
                  key={tab.id}
                  className={`kit-tab${activeFilter === tab.id ? " active" : ""}`}
                  onClick={() => setActiveFilter(tab.id)}
                  role="tab"
                  aria-selected={activeFilter === tab.id}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {loading && <p style={{ color: "var(--muted)", padding: "40px 0", textAlign: "center" }}>Loading the collection…</p>}
        {error && <p style={{ color: "var(--muted)", padding: "40px 0", textAlign: "center" }}>{error}</p>}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? false : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE_SILK }}
          >
            <RevealGroup className="store-grid-showcase" stagger={0.1} amount={0.05}>
              {filteredProducts.map((p, i) => (
                <KitCard key={p.id} product={p} index={i} />
              ))}
            </RevealGroup>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
