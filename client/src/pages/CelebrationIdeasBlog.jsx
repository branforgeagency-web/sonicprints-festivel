import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEOHead from "../components/SEOHead.jsx";
import { useSite, money } from "../context/SiteContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { EASE_SILK, EASE_INOUT } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";
import Tilt from "../components/fx/Tilt.jsx";
import { SectionAura } from "../components/fx/Decor.jsx";
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

export default function CelebrationIdeasBlog() {
  const { products } = useSite();
  const { addItem, openCart } = useCart();
  const { reduced } = useMotionProfile();
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track reading progress for top indicator bar
  useEffect(() => {
    function onScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleQuickAdd(slug) {
    const item = (products || []).find((p) => p.slug === slug);
    if (item) {
      addItem(item, 1);
      openCart();
    }
  }

  // Schema.org Article Structured Data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Planning Ganesh Chaturthi 2026? Don't Miss These Celebration Ideas",
    "alternativeHeadline": "Planning Ganesh Chaturthi 2026? Here Are 6 Ideas to Try",
    "image": [
      "https://sonicprints.shop/assets/img/blog/blog_1.jpeg",
      "https://sonicprints.shop/assets/img/blog/blog_2.jpeg",
      "https://sonicprints.shop/assets/img/blog/blog_3.jpeg",
      "https://sonicprints.shop/assets/img/blog/blog_4.jpeg",
      "https://sonicprints.shop/assets/img/blog/blog_5.jpeg",
      "https://sonicprints.shop/assets/img/blog/blog_6.jpeg",
      "https://sonicprints.shop/assets/img/blog/blog_7.jpeg"
    ],
    "datePublished": "2026-08-01T08:00:00+05:30",
    "dateModified": "2026-09-05T09:00:00+05:30",
    "author": {
      "@type": "Organization",
      "name": "Sonic Prints",
      "url": "https://sonicprints.shop"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sonic Prints",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sonicprints.shop/assets/img/hero-banner.jpg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://sonicprints.shop/ganesh-chaturthi-2026-celebration-ideas"
    },
    "description": "From festive home setups and kids' activities to décor, gifting and office celebrations, find ideas to make Ganesh Chaturthi 2026 memorable. Explore more."
  };

  return (
    <div className="page blog-article-page">
      {/* Scroll Reading Progress Bar */}
      <div
        className="blog-reading-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* SEO Head with exact user requested meta tags */}
      <SEOHead
        title="Planning Ganesh Chaturthi 2026? Here Are 6 Ideas to Try"
        description="From festive home setups and kids' activities to décor, gifting and office celebrations, find ideas to make Ganesh Chaturthi 2026 memorable. Explore more."
        canonical="/ganesh-chaturthi-2026-celebration-ideas"
        type="article"
        image={assetUrl("/assets/img/blog/blog_1.jpeg")}
        schema={articleSchema}
      />

      {/* Article Hero / Header */}
      <header className="blog-hero">
        <SectionAura tone="gold" mandala={true} />
        <div className="wrap">
          <div className="blog-hero-inner">
            {/* Breadcrumb Links */}
            <nav className="blog-breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="sep">/</span>
              <Link to="/blog">Blog</Link>
              <span className="sep">/</span>
              <span aria-current="page">Planning Ganesh Chaturthi 2026</span>
            </nav>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_SILK }}
            >
              <span className="blog-eyebrow">✦ FESTIVAL PLANNING GUIDE · GANESH CHATURTHI 2026</span>
              <h1 className="blog-h1">
                Planning Ganesh Chaturthi 2026? Don't Miss These Celebration Ideas
              </h1>

              <div className="blog-meta-strip">
                <span className="blog-meta-item">📅 August 2026</span>
                <span className="sep">·</span>
                <span className="blog-meta-item">⏱ 5 min read</span>
                <span className="sep">·</span>
                <span className="blog-meta-item">✍ By Sonic Prints Festive Studio</span>
              </div>
            </motion.div>

            {/* Quick jump pills */}
            <div className="blog-toc-bar">
              <div className="blog-toc-title">
                <span>✦</span> Quick Jump to Ideas:
              </div>
              <div className="blog-toc-pills">
                <a href="#idea-1" className="blog-toc-pill">🏛️ 1. Celebration Corner</a>
                <a href="#idea-2" className="blog-toc-pill">🎨 2. Kids Activities</a>
                <a href="#idea-3" className="blog-toc-pill">☸ 3. Experience Décor</a>
                <a href="#idea-4" className="blog-toc-pill">👨‍👩‍👧 4. Family Time</a>
                <a href="#idea-5" className="blog-toc-pill">🎁 5. Thoughtful Gifts</a>
                <a href="#idea-6" className="blog-toc-pill">🏢 6. Office Celebrations</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Article Body */}
      <main className="wrap">
        <div className="blog-content-wrap">
          {/* Intro Content Block */}
          <motion.div
            className="blog-intro-card"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: EASE_SILK }}
          >
            <div className="blog-intro-block">
              <p className="blog-intro-lead">
                Every Ganesh Chaturthi begins with excitement and then comes the planning.
              </p>
              <p>
                Where should we set up the puja? How should we decorate the space? What can the children do?
                Should we buy gifts? And if it is an office celebration, how do we make it meaningful for everyone?
              </p>
              <p>
                Before you know it, a joyful festival can turn into a long to-do list.
              </p>
              <p>
                But here's the thing: a memorable Ganesh Chaturthi celebration doesn't necessarily need a bigger budget,
                an elaborate setup or dozens of decorations. Sometimes, it simply comes down to choosing the right experiences.
              </p>
              <p>
                So, before you start{" "}
                <Link to="/" style={{ color: "#8C651F", fontWeight: 700, textDecoration: "underline" }}>
                  planning Ganesh Chaturthi 2026
                </Link>
                , here are a few celebration ideas that can help make the festival more creative, engaging and enjoyable
                for families, children and even workplaces.
              </p>
            </div>
          </motion.div>

          {/* IMAGE 1: Hero Editorial Showcase */}
          <motion.div
            className="blog-suite-panoramic-frame"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <Tilt max={4} lift={2}>
              <Link to="/" className="blog-image-link" title="Explore Ganesh Chaturthi 2026 Collection">
                <span className="blog-floating-badge">✦ FESTIVE INSPIRATION 2026</span>
                <img
                  src={assetUrl("/assets/img/blog/blog_1.jpeg")}
                  alt="Before Every New Beginning There Is Ganapathi - Sonic Prints Festival Collection"
                  loading="eager"
                />
              </Link>
              <div className="blog-suite-caption">
                <span className="blog-suite-caption-name">Before Every New Beginning, There Is Ganapathi</span>
                <Link to="/" className="blog-suite-caption-link">Explore Festival Collection →</Link>
              </div>
            </Tilt>
          </motion.div>

          {/* ================================================================
              CHAPTER 1: Celebration Corner (Gruha Ganapathi)
              ================================================================ */}
          <motion.article
            id="idea-1"
            className="blog-chapter-card blog-chapter-suite"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">IDEA 01</span>
                <span className="blog-chapter-category">SACRED PUJA SANCTUM</span>
              </div>
              <h2 className="blog-section-h2">
                Don't Just Set Up a Puja Space. Create a Celebration Corner.
              </h2>
            </div>

            {/* Narrative & Reflection */}
            <div className="blog-prose">
              <p className="blog-lead-text">
                The puja space is often the heart of the celebration. But creating one can sometimes involve more planning than expected.
              </p>
              <p>
                Choosing a backdrop, arranging decorative elements, finding the right space and making everything look coordinated can quickly turn into multiple small tasks.
              </p>
              <p>Instead of thinking about each item separately, start with one question:</p>
            </div>

            {/* Elevated Sacred Question Callout Box */}
            <div className="blog-suite-callout">
              <div className="blog-suite-quote-icon" aria-hidden="true">“</div>
              <div className="blog-suite-quote-body">
                <span className="blog-suite-quote-label">Sacred Design Principle</span>
                <p className="blog-suite-quote-text">How do you want this space to feel?</p>
              </div>
            </div>

            <div className="blog-prose" style={{ marginTop: 14 }}>
              <p>
                A well-planned celebration corner can bring together the puja setup, mandap, décor and festive details in one space. Consider:
              </p>
            </div>

            {/* Full-Width Visual Media Showcase */}
            <div style={{ marginTop: 24, marginBottom: 28 }}>
              <Tilt max={3} lift={2}>
                <div className="blog-suite-panoramic-frame">
                  <Link to="/kit/gruha-ganapathi-mandap" className="blog-image-link" title="Explore Gruha Ganapathi Instant Mandap">
                    <span className="blog-floating-badge">TEMPLE ARCHITECTURE</span>
                    <img
                      src={assetUrl("/assets/img/blog/blog_2.jpeg")}
                      alt="Don't Just Decorate. Create A Celebration Corner - Gruha Ganapathi"
                      loading="lazy"
                    />
                    <span className="blog-floating-badge-bottom">10-Min Tool-Free Setup</span>
                  </Link>
                  <div className="blog-suite-caption">
                    <span className="blog-suite-caption-name">Gruha Ganapathi Instant Mandap</span>
                    <Link to="/kit/gruha-ganapathi-mandap" className="blog-suite-caption-link">
                      View Kit ({money(699)}) →
                    </Link>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* 6 Essential Elements Grid */}
            <div className="blog-suite-pillars-section">
              <div className="blog-suite-pillars-header">
                <span className="blog-suite-pillars-tag">Essential Harmony</span>
                <h3 className="blog-suite-pillars-title">Key Elements of a Sacred Celebration Corner</h3>
              </div>

              <div className="blog-suite-pillars-grid">
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">✨</span>
                  <span className="blog-suite-pill-title">Organised puja area</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🏛️</span>
                  <span className="blog-suite-pill-title">Coordinated backdrop</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🌸</span>
                  <span className="blog-suite-pill-title">Fresh floral accents</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">💡</span>
                  <span className="blog-suite-pill-title">Ambient sacred lighting</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🪔</span>
                  <span className="blog-suite-pill-title">Simple decorative pieces</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">✦</span>
                  <span className="blog-suite-pill-title">Harmonious central setup</span>
                </div>
              </div>
            </div>

            {/* Lower Narrative & Philosophy */}
            <div className="blog-suite-lower">
              <div className="blog-prose blog-suite-lower-prose">
                <p>
                  For families looking for convenient Ganesh Chaturthi decoration ideas for home, starting from scratch isn't always necessary.
                </p>
                <p>
                  Sonic Prints' <strong>Gruha Ganapathi</strong> is designed for people who want to create a dedicated Ganapathi celebration space without spending time sourcing and coordinating every decorative element individually.
                </p>
                <p>
                  It helps turn an ordinary corner into a more organised festive setup—especially useful for busy households or homes with limited space.
                </p>
              </div>

              <div className="blog-suite-takeaway">
                <div className="blog-suite-takeaway-star">✦</div>
                <p>The idea is simple: don't just decorate a corner. Create a space where people naturally want to gather and celebrate.</p>
              </div>
            </div>

            {/* Integrated Grand Product Spotlight Card */}
            <div className="blog-suite-spotlight">
              <div className="blog-spotlight-info">
                <div className="blog-suite-spotlight-tag-row">
                  <span className="blog-suite-spotlight-tag">Featured Solution</span>
                  <span className="blog-suite-spotlight-badge">10-Min Tool-Free Setup</span>
                </div>
                <h3 className="blog-suite-spotlight-title">Gruha Ganapathi Instant Mandap</h3>
                <p className="blog-suite-spotlight-desc">10-Minute tool-free temple architecture plinth with 8 kg capacity.</p>
              </div>
              <div className="blog-spotlight-actions">
                <div className="blog-suite-price-box">
                  <span className="blog-suite-price-label">Complete Sanctum</span>
                  <span className="blog-suite-spotlight-price">{money(699)}</span>
                </div>
                <Link to="/kit/gruha-ganapathi-mandap" className="blog-btn-cta">
                  Explore Mandap →
                </Link>
                <button
                  type="button"
                  className="blog-btn-quick-add"
                  onClick={() => handleQuickAdd("gruha-ganapathi-mandap")}
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </motion.article>

          {/* ================================================================
              CHAPTER 2: Kids Activities (Bal Ganesh & Make Your Own Ganesha)
              ================================================================ */}
          <motion.article
            id="idea-2"
            className="blog-chapter-card blog-chapter-suite"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">IDEA 02</span>
                <span className="blog-chapter-category">LITTLE HANDS, BIG MEMORIES</span>
              </div>
              <h2 className="blog-section-h2">
                Give Children Something to Do, Not Just Something to Watch.
              </h2>
            </div>

            {/* Narrative & Reflection */}
            <div className="blog-prose">
              <p className="blog-lead-text">
                For children, festivals are often remembered through the things they get to do.
              </p>
              <p>
                But during festival preparation, children can sometimes become spectators while adults manage the decorations, arrangements and other responsibilities.
              </p>
              <p>Instead of asking them to simply watch the celebration, give them an active role in it:</p>
            </div>

            {/* Elevated Sacred Question Callout Box */}
            <div className="blog-suite-callout">
              <div className="blog-suite-quote-icon" aria-hidden="true">“</div>
              <div className="blog-suite-quote-body">
                <span className="blog-suite-quote-label">Family Principle</span>
                <p className="blog-suite-quote-text">Give children a role in the celebration, not just a seat in the room.</p>
              </div>
            </div>

            <div className="blog-prose" style={{ marginTop: 14 }}>
              <p>
                One of the best Ganesh Chaturthi activities for kids is something that allows them to participate, create and proudly share what they have made with loved ones.
              </p>
            </div>

            {/* Full-Width Visual Media Showcase */}
            <div style={{ marginTop: 24, marginBottom: 28 }}>
              <Tilt max={3} lift={2}>
                <div className="blog-suite-panoramic-frame">
                  <Link to="/kit/bal-ganesh-kids-kit" className="blog-image-link" title="Explore Bal Ganesh & Make Your Own Ganesha">
                    <span className="blog-floating-badge">HANDS-ON MEMORIES</span>
                    <img
                      src={assetUrl("/assets/img/blog/blog_3.jpeg")}
                      alt="Let Little Hands Create Big Festival Memories - Bal Ganesh, Make Your Own Ganesha"
                      loading="lazy"
                    />
                    <span className="blog-floating-badge-bottom">100% Eco Balcony Visarjan</span>
                  </Link>
                  <div className="blog-suite-caption">
                    <span className="blog-suite-caption-name">Bal Ganesh &amp; DIY Sculpting Kits</span>
                    <Link to="/kit/bal-ganesh-kids-kit" className="blog-suite-caption-link">
                      Explore Kids Kits →
                    </Link>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* 6 Hands-On Activities Grid */}
            <div className="blog-suite-pillars-section">
              <div className="blog-suite-pillars-header">
                <span className="blog-suite-pillars-tag">Creative Participation</span>
                <h3 className="blog-suite-pillars-title">Interactive Experiences for Young Devotees</h3>
              </div>

              <div className="blog-suite-pillars-grid">
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🎨</span>
                  <span className="blog-suite-pill-title">Festival Colouring</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">✂️</span>
                  <span className="blog-suite-pill-title">Creative Crafts</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">📖</span>
                  <span className="blog-suite-pill-title">Ganesha Legends</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🏺</span>
                  <span className="blog-suite-pill-title">River Clay DIY</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🌱</span>
                  <span className="blog-suite-pill-title">Seed Visarjan</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🏅</span>
                  <span className="blog-suite-pill-title">Eco Certificate</span>
                </div>
              </div>
            </div>

            {/* Lower Narrative & Philosophy */}
            <div className="blog-suite-lower">
              <div className="blog-prose blog-suite-lower-prose">
                <p>
                  For parents looking for an activity-led festival experience, Sonic Prints' <strong>Bal Ganesh</strong> brings children into the celebration through engaging and creative participation.
                </p>
                <p>
                  For families looking for something more hands-on, <strong>Make Your Own Ganesha</strong> adds another creative dimension by turning festival time into an opportunity to sculpt pure river clay together.
                </p>
              </div>

              <div className="blog-suite-takeaway">
                <div className="blog-suite-takeaway-star">✦</div>
                <p>Because sometimes the best festival memory for a child is not what they watched—but what they created.</p>
              </div>
            </div>

            {/* Dual Product Spotlight Cards in Suite */}
            <div className="blog-suite-dual-spotlight">
              <div className="blog-suite-mini-spotlight">
                <div>
                  <div className="blog-suite-spotlight-tag-row">
                    <span className="blog-suite-spotlight-tag">Kids Favourite</span>
                    <span className="blog-suite-spotlight-badge">Ages 4-12</span>
                  </div>
                  <h3 className="blog-spotlight-title">Bal Ganesh Activity Kit</h3>
                  <p className="blog-spotlight-desc">Storybook, unbaked clay moulding &amp; eco badge.</p>
                </div>
                <div className="blog-suite-mini-spotlight-actions">
                  <div className="blog-suite-price-box">
                    <span className="blog-suite-price-label">Activity Kit</span>
                    <span className="blog-spotlight-price">{money(349)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link to="/kit/bal-ganesh-kids-kit" className="blog-btn-cta">
                      Bal Ganesh →
                    </Link>
                    <button
                      type="button"
                      className="blog-btn-quick-add"
                      onClick={() => handleQuickAdd("bal-ganesh-kids-kit")}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="blog-suite-mini-spotlight">
                <div>
                  <div className="blog-suite-spotlight-tag-row">
                    <span className="blog-suite-spotlight-tag">100% Eco Visarjan</span>
                    <span className="blog-suite-spotlight-badge">Hands-on River Clay</span>
                  </div>
                  <h3 className="blog-spotlight-title">Make Your Own Ganesha</h3>
                  <p className="blog-spotlight-desc">River clay, wooden carving tools &amp; plantable seed ball.</p>
                </div>
                <div className="blog-suite-mini-spotlight-actions">
                  <div className="blog-suite-price-box">
                    <span className="blog-suite-price-label">Complete DIY Kit</span>
                    <span className="blog-spotlight-price">{money(499)}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <Link to="/kit/make-your-own-ganesha" className="blog-btn-cta blog-btn-cta-gold">
                      DIY Kit →
                    </Link>
                    <button
                      type="button"
                      className="blog-btn-quick-add"
                      onClick={() => handleQuickAdd("make-your-own-ganesha")}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.article>

          {/* ================================================================
              CHAPTER 3: Décor as an Experience (Motorized Rotating Chakra)
              ================================================================ */}
          <motion.article
            id="idea-3"
            className="blog-chapter-card blog-chapter-suite blog-chapter-dark"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">IDEA 03</span>
                <span className="blog-chapter-category">KINETIC DEVOTION</span>
              </div>
              <h2 className="blog-section-h2">
                Make the Décor Part of the Experience.
              </h2>
            </div>

            {/* Narrative & Reflection */}
            <div className="blog-prose">
              <p className="blog-lead-text">
                When people think about Ganesh Chaturthi decoration, they often focus only on how the final setup will look.
              </p>
              <p>
                But good décor can do more than make a space beautiful. It can create an atmosphere where people linger and connect.
              </p>
            </div>

            {/* Elevated Sacred Question Callout Box */}
            <div className="blog-suite-callout">
              <div className="blog-suite-quote-icon" aria-hidden="true">“</div>
              <div className="blog-suite-quote-body">
                <span className="blog-suite-quote-label">Experiential Principle</span>
                <p className="blog-suite-quote-text">It can create moments.</p>
              </div>
            </div>

            <div className="blog-prose" style={{ marginTop: 14 }}>
              <p>
                Think about where family members will gather. Where will everyone take photographs? What will become the visual highlight of the celebration?
              </p>
              <p>
                Instead of decorating every available corner, focus on creating one or two spaces that people will naturally notice and enjoy.
              </p>
            </div>

            {/* Full-Width Visual Media Showcase with Rotating Halo */}
            <div style={{ position: "relative", marginTop: 24, marginBottom: 28 }}>
              <motion.svg
                className="blog-chakra-halo-bg"
                viewBox="0 0 200 200"
                animate={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 16 }).map((_, i) => (
                  <ellipse
                    key={i}
                    cx="100"
                    cy="100"
                    rx="90"
                    ry="24"
                    transform={`rotate(${(i * 180) / 16} 100 100)`}
                    fill="none"
                    stroke="#F3D085"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="100" cy="100" r="54" fill="none" stroke="#F3D085" strokeWidth="1" />
              </motion.svg>

              <Tilt max={3} lift={2}>
                <div className="blog-suite-panoramic-frame">
                  <Link to="/kit/rotating-chakra-backdrop" className="blog-image-link" title="Explore Motorized Rotating Chakra">
                    <span className="blog-floating-badge" style={{ background: "rgba(243, 208, 133, 0.95)", color: "#0A2E2B" }}>
                      KINETIC SHOWPIECE
                    </span>
                    <img
                      src={assetUrl("/assets/img/blog/blog_4.jpeg")}
                      alt="Make Your Ganapathi Setup the Centre of Every Eye - Motorized Rotating Chakra"
                      loading="lazy"
                    />
                    <span className="blog-floating-badge-bottom">Whisper-Silent 2700K Glow</span>
                  </Link>
                  <div className="blog-suite-caption">
                    <span className="blog-suite-caption-name">Distinctive Centerpiece: Rotating Chakra</span>
                    <Link to="/kit/rotating-chakra-backdrop" className="blog-suite-caption-link">
                      View Chakra ({money(999)}) →
                    </Link>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* 6 Kinetic Highlights Grid */}
            <div className="blog-suite-pillars-section">
              <div className="blog-suite-pillars-header">
                <span className="blog-suite-pillars-tag">Kinetic Architecture</span>
                <h3 className="blog-suite-pillars-title">Engineering Sacred Motion &amp; Illumination</h3>
              </div>

              <div className="blog-suite-pillars-grid">
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">☸</span>
                  <span className="blog-suite-pill-title">Whisper-silent motor</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">📸</span>
                  <span className="blog-suite-pill-title">Dedicated photo highlight</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">💡</span>
                  <span className="blog-suite-pill-title">Warm 2700K ambient glow</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🌸</span>
                  <span className="blog-suite-pill-title">Sacred floral mandala</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🌺</span>
                  <span className="blog-suite-pill-title">Continuous rotation</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">✨</span>
                  <span className="blog-suite-pill-title">Mesmerizing centerpiece</span>
                </div>
              </div>
            </div>

            {/* Lower Narrative & Philosophy */}
            <div className="blog-suite-lower">
              <div className="blog-prose blog-suite-lower-prose">
                <p>
                  The challenge with larger setups is often finding that one element that makes the entire space stand out.
                </p>
                <p>
                  Sonic Prints' <strong>Motorized Rotating Chakra</strong> is designed to add a visually engaging element to a Ganapathi setup, backdrop or celebration area.
                </p>
                <p>
                  Rather than adding more and more decorations, one distinctive centrepiece can create a stronger visual impact and become a natural point of attention.
                </p>
              </div>

              <div className="blog-suite-takeaway">
                <div className="blog-suite-takeaway-star">✦</div>
                <p>The goal isn't to decorate more. It's to create something people remember.</p>
              </div>
            </div>

            {/* Integrated Grand Product Spotlight Card */}
            <div className="blog-suite-spotlight">
              <div className="blog-spotlight-info">
                <div className="blog-suite-spotlight-tag-row">
                  <span className="blog-suite-spotlight-tag">Kinetic Showstopper</span>
                  <span className="blog-suite-spotlight-badge">Dual-Layer Mandala</span>
                </div>
                <h3 className="blog-suite-spotlight-title">Motorized Rotating Chakra</h3>
                <p className="blog-suite-spotlight-desc">Continuous silent motor with 2700K ambient halo reflections.</p>
              </div>
              <div className="blog-spotlight-actions">
                <div className="blog-suite-price-box">
                  <span className="blog-suite-price-label">Kinetic Centerpiece</span>
                  <span className="blog-suite-spotlight-price">{money(999)}</span>
                </div>
                <Link to="/kit/rotating-chakra-backdrop" className="blog-btn-cta blog-btn-cta-gold">
                  Explore Chakra →
                </Link>
                <button
                  type="button"
                  className="blog-btn-quick-add"
                  onClick={() => handleQuickAdd("rotating-chakra-backdrop")}
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </motion.article>

          {/* ================================================================
              CHAPTER 4: Family Time & Celebration Flow Timeline
              ================================================================ */}
          <motion.article
            id="idea-4"
            className="blog-chapter-card blog-chapter-suite"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">IDEA 04</span>
                <span className="blog-chapter-category">TOGETHER IN CELEBRATION</span>
              </div>
              <h2 className="blog-section-h2">
                Turn Festival Preparation into Family Time.
              </h2>
            </div>

            <div className="blog-prose">
              <p className="blog-lead-text">
                One of the easiest ways to make Ganesh Chaturthi more meaningful is to stop treating preparation as work that needs to be finished. Preparation itself can become part of the celebration.
              </p>
              <p>
                Instead of one person managing an endless checklist, involve everyone in small ways. Someone can help with decoration. Children can participate in creative activities. Family members can organise the celebration space together.
              </p>
            </div>

            {/* Connected Timeline Stepper */}
            <div className="blog-suite-pillars-section" style={{ marginTop: 24, marginBottom: 24 }}>
              <div className="blog-suite-pillars-header">
                <span className="blog-suite-pillars-tag">Harmonious Rhythm</span>
                <h3 className="blog-suite-pillars-title">The Sacred Festival Day Flow</h3>
              </div>

              <div className="blog-timeline-stepper">
                <div className="blog-timeline-step">
                  <div className="blog-timeline-badge">01</div>
                  <span className="blog-timeline-time">🌅 Morning · 8:00 AM</span>
                  <h3 className="blog-timeline-title">Puja &amp; Sanctum Sthapana</h3>
                  <p className="blog-timeline-text">Cleanse the altar, assemble the instant mandap, and place holy samagri together.</p>
                </div>
                <div className="blog-timeline-step">
                  <div className="blog-timeline-badge">02</div>
                  <span className="blog-timeline-time">🎨 Afternoon · 2:00 PM</span>
                  <h3 className="blog-timeline-title">Kids Craft &amp; Storytelling</h3>
                  <p className="blog-timeline-text">Hands-on river clay sculpting, Ganesha coloring, and sharing legends of Bappa.</p>
                </div>
                <div className="blog-timeline-step">
                  <div className="blog-timeline-badge">03</div>
                  <span className="blog-timeline-time">✨ Evening · 6:30 PM</span>
                  <h3 className="blog-timeline-title">Aarti, Illumination &amp; Prasadam</h3>
                  <p className="blog-timeline-text">Turn on the motorized chakra halo, chant holy aarti, and capture joyful family portraits.</p>
                </div>
              </div>
            </div>

            {/* Large Panoramic Showcase Media Frame */}
            <div style={{ marginTop: 28, marginBottom: 28 }}>
              <Tilt max={3} lift={2}>
                <div className="blog-suite-panoramic-frame">
                  <Link to="/" className="blog-image-link" title="Explore the Ganesh Chaturthi 2026 Collection">
                    <span className="blog-floating-badge">ONE FESTIVAL · MANY EXPERIENCES</span>
                    <img
                      src={assetUrl("/assets/img/blog/blog_7.jpeg")}
                      alt="One Festival. So Many Ways to Celebrate - Explore the Ganesh Chaturthi 2026 Collection"
                      loading="lazy"
                    />
                    <span className="blog-floating-badge-bottom">Sonic Prints 2026 Collection</span>
                  </Link>
                  <div className="blog-suite-caption">
                    <span className="blog-suite-caption-name">One Festival. So Many Ways to Celebrate — Ganesh Chaturthi 2026 Collection</span>
                    <Link to="/" className="blog-suite-caption-link">
                      Explore Festival Collection →
                    </Link>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* Lower Narrative & Philosophy */}
            <div className="blog-suite-lower" style={{ margin: "24px 0 0" }}>
              <div className="blog-prose blog-suite-lower-prose">
                <p>
                  The exact plan can vary from family to family. What matters is giving everyone a role.
                </p>
                <p>
                  When every item has to be sourced separately, preparation can become stressful. But when the right elements are already planned around a specific festival experience, families can spend less time managing arrangements and more time enjoying them.
                </p>
              </div>

              <div className="blog-suite-takeaway">
                <div className="blog-suite-takeaway-star">✦</div>
                <p>A celebration often becomes more memorable when people feel involved in creating it.</p>
              </div>
            </div>
          </motion.article>

          {/* ================================================================
              CHAPTER 5: Thoughtful Gifting (Shubharambh Mini)
              ================================================================ */}
          <motion.article
            id="idea-5"
            className="blog-chapter-card blog-chapter-suite"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">IDEA 05</span>
                <span className="blog-chapter-category">SACRED FESTIVE GIFTING</span>
              </div>
              <h2 className="blog-section-h2">
                Make Your Ganesh Chaturthi Gifts Part of the Celebration.
              </h2>
            </div>

            {/* Narrative & Reflection */}
            <div className="blog-prose">
              <p className="blog-lead-text">
                Choosing a festival gift sounds simple—until you start looking for one.
              </p>
              <p>
                Generic gifts may not feel connected to the occasion. Buying multiple items separately can take time. And sometimes, the final gift looks festive but doesn't actually become part of the celebration.
              </p>
              <p>A better approach is to choose something that feels deeply relevant to the sacred occasion itself.</p>
            </div>

            {/* Elevated Sacred Question Callout Box */}
            <div className="blog-suite-callout">
              <div className="blog-suite-quote-icon" aria-hidden="true">“</div>
              <div className="blog-suite-quote-body">
                <span className="blog-suite-quote-label">Gifting Philosophy</span>
                <p className="blog-suite-quote-text">A festival gift should not just be given—it should belong to the ritual.</p>
              </div>
            </div>

            <div className="blog-prose" style={{ marginTop: 14 }}>
              <p>
                Instead of choosing something completely unrelated to Ganesh Chaturthi, a festival-focused product naturally becomes part of the celebration experience for the receiver.
              </p>
            </div>

            {/* Full-Width Visual Media Showcase */}
            <div style={{ marginTop: 24, marginBottom: 28 }}>
              <Tilt max={3} lift={2}>
                <div className="blog-suite-panoramic-frame">
                  <Link to="/kit/shubharambh-mini" className="blog-image-link" title="Explore Shubharambh Mini">
                    <span className="blog-floating-badge">SACRED RETURN GIFT</span>
                    <img
                      src={assetUrl("/assets/img/blog/blog_5.jpeg")}
                      alt="This Festive Season, Gift More Than Just A Box - Shubharambh Mini"
                      loading="lazy"
                    />
                    <span className="blog-floating-badge-bottom">100% Water-Soluble Clay</span>
                  </Link>
                  <div className="blog-suite-caption">
                    <span className="blog-suite-caption-name">Festive Gifting: Shubharambh Mini Box</span>
                    <Link to="/kit/shubharambh-mini" className="blog-suite-caption-link">
                      View Kit ({money(299)}) →
                    </Link>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* 4 Pillars of Meaningful Gifting Grid */}
            <div className="blog-suite-pillars-section">
              <div className="blog-suite-pillars-header">
                <span className="blog-suite-pillars-tag">Thoughtful Giving</span>
                <h3 className="blog-suite-pillars-title">The Four Marks of a Memorable Festive Gift</h3>
              </div>

              <div className="blog-suite-pillars-grid blog-suite-pillars-grid-4">
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🎁</span>
                  <span className="blog-suite-pill-title">Used during the festival</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🪔</span>
                  <span className="blog-suite-pill-title">Devotional connection</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🏡</span>
                  <span className="blog-suite-pill-title">Suitable for every home</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">💖</span>
                  <span className="blog-suite-pill-title">Creates an experience</span>
                </div>
              </div>
            </div>

            {/* Lower Narrative & Philosophy */}
            <div className="blog-suite-lower">
              <div className="blog-prose blog-suite-lower-prose">
                <p>
                  This is where Sonic Prints' <strong>Shubharambh Mini</strong> can become a relevant festive choice.
                </p>
                <p>
                  That is what makes gifting feel more thoughtful—not necessarily the size of the gift, but its relevance to the moment and the sentiment it carries into another home.
                </p>
              </div>

              <div className="blog-suite-takeaway">
                <div className="blog-suite-takeaway-star">✦</div>
                <p>Because a good festival gift shouldn't just be given. It should feel like it belongs to the celebration.</p>
              </div>
            </div>

            {/* Integrated Grand Product Spotlight Card */}
            <div className="blog-suite-spotlight">
              <div className="blog-spotlight-info">
                <div className="blog-suite-spotlight-tag-row">
                  <span className="blog-suite-spotlight-tag">Best Seller Gifting Kit</span>
                  <span className="blog-suite-spotlight-badge">Complete Ritual Samagri</span>
                </div>
                <h3 className="blog-suite-spotlight-title">Shubharambh Mini Puja Box</h3>
                <p className="blog-suite-spotlight-desc">Natural clay idol, complete samagri, sealed prasadam &amp; katha.</p>
              </div>
              <div className="blog-spotlight-actions">
                <div className="blog-suite-price-box">
                  <span className="blog-suite-price-label">Sacred Gifting Box</span>
                  <span className="blog-suite-spotlight-price">{money(299)}</span>
                </div>
                <Link to="/kit/shubharambh-mini" className="blog-btn-cta">
                  Explore Mini →
                </Link>
                <button
                  type="button"
                  className="blog-btn-quick-add"
                  onClick={() => handleQuickAdd("shubharambh-mini")}
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </motion.article>

          {/* ================================================================
              CHAPTER 6: Workplace Celebrations (Employee Puja Box)
              ================================================================ */}
          <motion.article
            id="idea-6"
            className="blog-chapter-card blog-chapter-suite"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">IDEA 06</span>
                <span className="blog-chapter-category">WORKPLACE &amp; COMMUNITY</span>
              </div>
              <h2 className="blog-section-h2">
                Don't Leave Office Celebrations Until the Last Minute.
              </h2>
            </div>

            {/* Narrative & Reflection */}
            <div className="blog-prose">
              <p className="blog-lead-text">
                Ganesh Chaturthi celebrations are no longer limited to homes. Many workplaces also use festivals as an opportunity to bring teams together.
              </p>
              <p>
                HR and Admin teams may need to think about employee participation, decoration, gifting, quantities and coordination—all while managing regular work schedules.
              </p>
              <p>
                The good news is that a meaningful Ganesh Chaturthi office celebration doesn't need to take over the entire workday.
              </p>
            </div>

            {/* Elevated Sacred Question Callout Box */}
            <div className="blog-suite-callout">
              <div className="blog-suite-quote-icon" aria-hidden="true">“</div>
              <div className="blog-suite-quote-body">
                <span className="blog-suite-quote-label">Workplace Culture Principle</span>
                <p className="blog-suite-quote-text">Create a small festive moment that brings people together.</p>
              </div>
            </div>

            <div className="blog-prose" style={{ marginTop: 14 }}>
              <p>
                It gives organisations a more relevant way to acknowledge the festival while making gifting easier to plan across multiple employees with custom company sleeves and leadership video greeting cards.
              </p>
            </div>

            {/* Full-Width Visual Media Showcase */}
            <div style={{ marginTop: 24, marginBottom: 28 }}>
              <Tilt max={3} lift={2}>
                <div className="blog-suite-panoramic-frame">
                  <Link to="/kit/employee-puja-box" className="blog-image-link" title="Explore Employee Puja Box">
                    <span className="blog-floating-badge">CORPORATE FESTIVE SUITE</span>
                    <img
                      src={assetUrl("/assets/img/blog/blog_6.jpeg")}
                      alt="A Small Celebration Can Bring a Whole Team Together - Employee Puja Box"
                      loading="lazy"
                    />
                    <span className="blog-floating-badge-bottom">Custom Sleeve &amp; QR Video</span>
                  </Link>
                  <div className="blog-suite-caption">
                    <span className="blog-suite-caption-name">Employee Puja Box (Corporate Edition)</span>
                    <Link to="/kit/employee-puja-box" className="blog-suite-caption-link">
                      View Box ({money(499)}) →
                    </Link>
                  </div>
                </div>
              </Tilt>
            </div>

            {/* 6 Workplace Checklist Pillars Grid */}
            <div className="blog-suite-pillars-section">
              <div className="blog-suite-pillars-header">
                <span className="blog-suite-pillars-tag">Seamless Coordination</span>
                <h3 className="blog-suite-pillars-title">The Complete Workplace Celebration Blueprint</h3>
              </div>

              <div className="blog-suite-pillars-grid">
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🏢</span>
                  <span className="blog-suite-pill-title">Desk-to-altar puja box</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">📸</span>
                  <span className="blog-suite-pill-title">Photo-friendly setup</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🤝</span>
                  <span className="blog-suite-pill-title">Short team gathering</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🎨</span>
                  <span className="blog-suite-pill-title">Voluntary desk crafts</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">🎁</span>
                  <span className="blog-suite-pill-title">Custom branded sleeves</span>
                </div>
                <div className="blog-suite-pill">
                  <span className="blog-suite-pill-icon">📋</span>
                  <span className="blog-suite-pill-title">Early bulk coordination</span>
                </div>
              </div>
            </div>

            {/* Lower Narrative & Philosophy */}
            <div className="blog-suite-lower">
              <div className="blog-prose blog-suite-lower-prose">
                <p>
                  For companies looking for a more organized option, Sonic Prints' <strong>Employee Puja Box</strong> offers a festival-focused gifting solution designed around the occasion.
                </p>
                <p>
                  With custom company sleeves, leadership QR video greeting cards, and complete ritual items, your teams celebrate effortlessly without administrative headaches.
                </p>
              </div>

              <div className="blog-suite-takeaway">
                <div className="blog-suite-takeaway-star">✦</div>
                <p>The goal isn't simply to organise another office event. It's to create a small festive moment that brings people together.</p>
              </div>
            </div>

            {/* Integrated Grand Product Spotlight Card with Dual Action */}
            <div className="blog-suite-spotlight">
              <div className="blog-spotlight-info">
                <div className="blog-suite-spotlight-tag-row">
                  <span className="blog-suite-spotlight-tag">Corporate Favourite</span>
                  <span className="blog-suite-spotlight-badge">Custom Branding Available</span>
                </div>
                <h3 className="blog-suite-spotlight-title">Employee Puja Box (Corporate Edition)</h3>
                <p className="blog-suite-spotlight-desc">Respectfully unbranded idol, custom sleeve &amp; leadership QR video greeting.</p>
              </div>
              <div className="blog-spotlight-actions">
                <div className="blog-suite-price-box">
                  <span className="blog-suite-price-label">Corporate Box</span>
                  <span className="blog-suite-spotlight-price">{money(499)}</span>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link to="/kit/employee-puja-box" className="blog-btn-cta">
                    Explore Box →
                  </Link>
                  <Link to="/bulk" className="blog-btn-cta blog-btn-cta-gold">
                    Bulk Enquiry →
                  </Link>
                </div>
              </div>
            </div>
          </motion.article>

          {/* ================================================================
              CONVENIENCE SECTION (Interactive Problem → Solution Matrix)
              ================================================================ */}
          <motion.section
            className="blog-chapter-card"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <div className="blog-chapter-header">
              <div className="blog-chapter-meta-top">
                <span className="blog-chapter-num-badge">SUMMARY</span>
                <span className="blog-chapter-category">SMART PLANNING</span>
              </div>
              <h2 className="blog-section-h2">
                Convenience Can Also Be Part of a Good Celebration.
              </h2>
            </div>

            <div className="blog-prose">
              <p>One thing that often gets overlooked while planning a festival is time.</p>
              <p>
                Between work, family responsibilities and everyday schedules, not everyone has the time to visit multiple places searching for puja products, children's activities, décor and gifts.
              </p>
              <p>The right festival products can solve different planning problems:</p>

              {/* Problem / Solution Interactive Matrix */}
              <div className="blog-solutions-matrix">
                <div className="blog-solution-item">
                  <div className="blog-solution-item-left">
                    <div className="blog-solution-q">🏠 Need a festive home setup?</div>
                    <p className="blog-solution-a">Choose a solution designed around the celebration space without tool or carpenter hassles.</p>
                  </div>
                  <Link to="/kit/gruha-ganapathi-mandap" className="blog-solution-btn">
                    Gruha Ganapathi ({money(699)}) →
                  </Link>
                </div>

                <div className="blog-solution-item">
                  <div className="blog-solution-item-left">
                    <div className="blog-solution-q">🎨 Looking to engage children?</div>
                    <p className="blog-solution-a">Add an active clay moulding, storytelling and eco visarjan activity they can proudly share.</p>
                  </div>
                  <Link to="/kit/bal-ganesh-kids-kit" className="blog-solution-btn">
                    Bal Ganesh &amp; DIY ({money(349)}) →
                  </Link>
                </div>

                <div className="blog-solution-item">
                  <div className="blog-solution-item-left">
                    <div className="blog-solution-q">✨ Want your décor to stand out?</div>
                    <p className="blog-solution-a">Focus on one memorable kinetic visual element with whisper-silent motor and warm 2700K glow.</p>
                  </div>
                  <Link to="/kit/rotating-chakra-backdrop" className="blog-solution-btn">
                    Rotating Chakra ({money(999)}) →
                  </Link>
                </div>

                <div className="blog-solution-item">
                  <div className="blog-solution-item-left">
                    <div className="blog-solution-q">🎁 Searching for a relevant festival gift?</div>
                    <p className="blog-solution-a">Choose a complete sacred box that connects directly to the festival morning ritual.</p>
                  </div>
                  <Link to="/kit/shubharambh-mini" className="blog-solution-btn">
                    Shubharambh Mini ({money(299)}) →
                  </Link>
                </div>

                <div className="blog-solution-item">
                  <div className="blog-solution-item-left">
                    <div className="blog-solution-q">🏢 Planning for employees?</div>
                    <p className="blog-solution-a">Look for solutions that simplify gifting, packaging, custom branding and bulk coordination.</p>
                  </div>
                  <Link to="/kit/employee-puja-box" className="blog-solution-btn">
                    Employee Puja Box ({money(499)}) →
                  </Link>
                </div>
              </div>

              <p>This is where having multiple celebration solutions in one place becomes useful.</p>
              <p>The purpose isn't to buy more products. It's to choose the right product for the right part of the celebration.</p>
              <p>
                Less time managing preparation can mean more time actually enjoying Ganesh Chaturthi.
              </p>
            </div>
          </motion.section>

          {/* ================================================================
              WHAT SHOULD YOU REALLY PLAN SECTION (Festive Blueprint)
              ================================================================ */}
          <motion.div
            className="blog-blueprint-card"
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <h2 className="blog-section-h2" style={{ fontSize: "clamp(24px, 3.4vw, 32px)", marginBottom: 16 }}>
              So, What Should You Really Plan for Ganesh Chaturthi 2026?
            </h2>

            <div className="blog-prose">
              <p>
                Before you start shopping, decorating or creating a long checklist, think about one simple question:
              </p>

              <div className="blog-question-callout">
                <p>What kind of experience do you want people to remember?</p>
              </div>

              <div className="blog-blueprint-grid">
                <div className="blog-blueprint-item">
                  <span style={{ color: "#D4AF37" }}>🪔</span>
                  <span>A peaceful, heartfelt family celebration</span>
                </div>
                <div className="blog-blueprint-item">
                  <span style={{ color: "#D4AF37" }}>🏛️</span>
                  <span>A beautifully designed Ganapathi corner</span>
                </div>
                <div className="blog-blueprint-item">
                  <span style={{ color: "#D4AF37" }}>🎨</span>
                  <span>A child's first creative clay activity</span>
                </div>
                <div className="blog-blueprint-item">
                  <span style={{ color: "#D4AF37" }}>📸</span>
                  <span>A memorable family portrait with glowing halo</span>
                </div>
                <div className="blog-blueprint-item">
                  <span style={{ color: "#D4AF37" }}>🎁</span>
                  <span>A thoughtful sacred festival gift</span>
                </div>
                <div className="blog-blueprint-item">
                  <span style={{ color: "#D4AF37" }}>🏢</span>
                  <span>A celebration that brings an entire team together</span>
                </div>
              </div>

              <p>Ganesh Chaturthi doesn't have to follow one standard format.</p>
              <p>
                You can keep it simple. Make it creative. Involve the children. Add a visual touch. Choose gifts that feel relevant. Bring the celebration into your workplace.
              </p>
              <p style={{ fontWeight: 700, color: "#0A2E2B", fontSize: "17.5px" }}>
                For Ganesh Chaturthi 2026, plan beyond the checklist and create moments worth remembering.
              </p>
            </div>
          </motion.div>

          {/* ================================================================
              GRAND FINALE CTA
              ================================================================ */}
          <motion.section
            className="blog-grand-cta"
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: EASE_SILK }}
          >
            <h3>Celebrate Your Way with Sonic Prints</h3>
            <p>
              From creating a festive corner with Gruha Ganapathi and engaging children with Bal Ganesh and Make Your Own Ganesha, to adding visual impact with the Motorized Rotating Chakra, choosing Shubharambh Mini for festive gifting or planning employee celebrations with the Employee Puja Box—Sonic Prints brings together different ways to celebrate.
            </p>
            <Link to="/" className="blog-btn-grand">
              ✦ Explore the Ganesh Chaturthi 2026 Collection ✦
            </Link>
          </motion.section>

          {/* ================================================================
              FEATURED 6 FESTIVAL KITS GRID
              ================================================================ */}
          <section className="blog-product-showcase">
            <h3 className="blog-showcase-title">Featured Festival Kits (2026 Collection)</h3>
            <p className="blog-showcase-sub">
              Crafted with 100% natural clay, sealed FSSAI prasadam, and pure South Indian devotion.
            </p>

            <div className="bm-grid">
              {SIX_PRODUCTS.map((prod, idx) => (
                <motion.article
                  key={prod.slug}
                  className="bm-card"
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: 0.06 * idx, ease: EASE_SILK }}
                >
                  <Tilt max={6} lift={2} className="bm-card-media">
                    <Link to={`/kit/${prod.slug}`} tabIndex={-1} aria-hidden="true">
                      <img src={assetUrl(prod.img)} alt={prod.name} loading="lazy" />
                      <span className="bm-badge">{prod.badge}</span>
                      <span className="bm-price">{money(prod.price)}</span>
                    </Link>
                  </Tilt>

                  <div className="bm-card-body">
                    <div className="bm-card-head">
                      <span className="bm-card-sub">{prod.subtitle}</span>
                      <h4 className="bm-card-title">
                        <Link to={`/kit/${prod.slug}`}>{prod.name}</Link>
                      </h4>
                    </div>

                    <p className="bm-card-desc">{prod.desc}</p>

                    <div className="bm-tags">
                      {prod.tags.map((t) => (
                        <span key={t} className="bm-tag">{t}</span>
                      ))}
                    </div>

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
          </section>
        </div>
      </main>
    </div>
  );
}
