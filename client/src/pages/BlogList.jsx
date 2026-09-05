import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead.jsx";
import { useSite, money } from "../context/SiteContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";
import { assetUrl } from "../utils/assetHelper.js";

const SIX_PRODUCTS = [
  {
    slug: "shubharambh-mini",
    name: "Shubharambh Mini",
    subtitle: "10-Minute Complete Puja Kit",
    price: 299,
    badge: "Best Seller",
    img: "/assets/img/mini.jpg",
    desc: "Complete sacred puja in one compact box — unbaked clay idol, holy samagri, printed katha, and sealed prasadam.",
    tags: ["Natural Clay Idol", "Complete Samagri", "Sealed Prasadam"]
  },
  {
    slug: "employee-puja-box",
    name: "Employee Puja Box",
    subtitle: "Corporate Festive Edition",
    price: 499,
    badge: "Corporate Favourite",
    img: "/assets/img/employee.jpg",
    desc: "Blessings that travel home to family altars. Respectfully unbranded idol with custom company sleeve and video greeting.",
    tags: ["Custom Sleeve", "Leadership QR Video", "Family Sankalp"]
  },
  {
    slug: "bal-ganesh-kids-kit",
    name: "Bal Ganesh Kids Kit",
    subtitle: "Story & Craft Activity Box",
    price: 349,
    badge: "Kids Favourite",
    img: "/assets/img/kids.jpg",
    desc: "Connecting young hearts to living culture through tactile clay moulding, illustrated stories, and eco certificates.",
    tags: ["Storybook", "Organic Clay", "Eco Certificate"]
  },
  {
    slug: "make-your-own-ganesha",
    name: "Make Your Own Ganesha",
    subtitle: "DIY River Clay Sculpting",
    price: 499,
    badge: "100% Eco Visarjan",
    img: "/assets/img/diy.jpg",
    desc: "Hand-sculpt your own Bappa with pure river clay, wooden carving tools, and organic seed ball for balcony visarjan.",
    tags: ["River Terracotta", "Wooden Tools", "Seed Visarjan"]
  },
  {
    slug: "gruha-ganapathi-mandap",
    name: "Gruha Ganapathi Mandap",
    subtitle: "10-Minute Temple Sanctum",
    price: 699,
    badge: "Temple Architecture",
    img: "/assets/img/mandap.jpg",
    desc: "Grand South Indian temple arch and load-bearing plinth that interlocks without tools, nails, or carpentry mess.",
    tags: ["Tool-Free Assembly", "8 kg Load Plinth", "Reusable"]
  },
  {
    slug: "rotating-chakra-backdrop",
    name: "Rotating Chakra Backdrop",
    subtitle: "Motorized Divine Halo",
    price: 999,
    badge: "Kinetic Decor",
    img: "/assets/img/chakra-classic.jpg",
    desc: "Whisper-quiet continuous motorized rotation with warm 2700K ambient LED reflections behind Lord Ganesha.",
    tags: ["Whisper-Silent Motor", "Warm 2700K Glow", "Plug & Play"]
  }
];

export default function BlogList() {
  const { products } = useSite();
  const { addItem, openCart } = useCart();
  const { reduced } = useMotionProfile();

  function handleQuickAdd(slug) {
    const item = (products || []).find((p) => p.slug === slug);
    if (item) {
      addItem(item, 1);
      openCart();
    }
  }

  return (
    <div className="page blog-minimal-page">
      <SEOHead
        title="Festival Collection | 6 Sacred Kits | Sonic Prints 2026"
        description="Discover our six curated Ganesh Festival 2026 collections — crafted with natural clay, sacred samagri, and authentic South Indian devotion."
        canonical="/blog"
      />

      {/* Minimal Luxury Header */}
      <header className="bm-hero">
        <div className="wrap">
          <motion.div
            className="bm-hero-content"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_SILK }}
          >
            <span className="bm-eyebrow">✦ 2026 FESTIVAL COLLECTION</span>
            <h1 className="bm-title">Six Kits. Crafted for Celebration.</h1>
            <p className="bm-subtitle">
              One design system, six complete experiences — crafted with 100% natural clay, sealed prasadam, and sacred tradition.
            </p>
          </motion.div>
        </div>
      </header>

      {/* 6 Products Clean Grid */}
      <section className="bm-grid-section">
        <div className="wrap">
          <div className="bm-grid">
            {SIX_PRODUCTS.map((prod, idx) => (
              <motion.article
                key={prod.slug}
                className="bm-card"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: 0.06 * idx, ease: EASE_SILK }}
              >
                {/* Visual Image */}
                <Link to={`/kit/${prod.slug}`} className="bm-card-media" tabIndex={-1} aria-hidden="true">
                  <img src={assetUrl(prod.img)} alt={prod.name} loading="lazy" />
                  <span className="bm-badge">{prod.badge}</span>
                  <span className="bm-price">{money(prod.price)}</span>
                </Link>

                {/* Card Content */}
                <div className="bm-card-body">
                  <div className="bm-card-head">
                    <span className="bm-card-sub">{prod.subtitle}</span>
                    <h2 className="bm-card-title">
                      <Link to={`/kit/${prod.slug}`}>{prod.name}</Link>
                    </h2>
                  </div>

                  <p className="bm-card-desc">{prod.desc}</p>

                  {/* Minimal Tags */}
                  <div className="bm-tags">
                    {prod.tags.map((t) => (
                      <span key={t} className="bm-tag">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="bm-card-actions">
                    <Link to={`/kit/${prod.slug}`} className="bm-btn-view">
                      View Kit →
                    </Link>
                    <button
                      type="button"
                      className="bm-btn-add"
                      onClick={() => handleQuickAdd(prod.slug)}
                    >
                      Add to Cart · {money(prod.price)}
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Minimal Bottom Line */}
          <div className="bm-footer-note">
            <span>Natural clay idols · Sealed FSSAI prasadam · GST inclusive · Pan-India delivery</span>
          </div>
        </div>
      </section>
    </div>
  );
}
