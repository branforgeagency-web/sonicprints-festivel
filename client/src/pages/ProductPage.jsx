import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getProductBySlug } from "../api/client.js";
import { imgUrl, money, useSite } from "../context/SiteContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import useReveal from "../hooks/useReveal.js";
import KitCard from "../components/KitCard.jsx";
import Icon from "../components/Icon.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, RevealGroup } from "../components/fx/Reveal.jsx";
import { useProductTransition } from "../components/fx/ProductTransition.jsx";
import { EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";
import SEOHead from "../components/SEOHead.jsx";

// Category fallback image keys
const STORE_IMAGE = { chakra: "display-chakra", kids: "display-kids", diy: "display-kids" };
const FADE_IN = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SILK } } };

const ASSURE_BULLETS = [
  { title: "Natural clay idol", text: "no plaster of Paris, no thermocol, safe for home visarjan." },
  { title: "Sealed prasadam", text: "from an FSSAI-licensed supplier, with licence number and best-before printed on pack." },
  { title: "Pre-festival delivery", text: "guaranteed delivery before the festival across serviced cities." },
  { title: "Custom branding available", text: "on sleeves, cards and certificates — never on the idol." }
];

export default function ProductPage() {
  const { config } = useSite();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [crossSell, setCrossSell] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { registerTarget } = useProductTransition();
  const { reduced } = useMotionProfile();
  const galRef = useRef(null);
  useReveal();

  const [variantId, setVariantId] = useState(null);
  const [designId, setDesignId] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [activePolicyTab, setActivePolicyTab] = useState("returns");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProductBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        const { crossSellProducts, ...p } = data;
        setProduct(p);
        setCrossSell(crossSellProducts || []);
        setVariantId(p.variants?.length ? p.variants[0].id : null);
        const requestedDesign = searchParams.get("design");
        const design = p.designs?.find((d) => d.id === requestedDesign) || p.designs?.[0];
        setDesignId(design?.id || null);
        setQty(1);
        setActiveThumb(0);
        window.scrollTo({ top: 0 });
      })
      .catch(() => !cancelled && setError("This product could not be found."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [slug, searchParams]);

  useEffect(() => {
    if (loading || !product) return;
    registerTarget(galRef.current);
  }, [loading, product, registerTarget]);

  const variant = useMemo(() => product?.variants?.find((v) => v.id === variantId), [product, variantId]);
  const design = useMemo(() => product?.designs?.find((d) => d.id === designId), [product, designId]);
  const unitPrice = variant ? variant.price : product?.price || 0;

  if (loading) {
    return (
      <div className="page">
        <div className="wrap pageLoader" role="status" aria-live="polite">
          <span className="pageLoader-ring" aria-hidden="true" />
          <span>Loading product details…</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="wrap" style={{ padding: "60px 0" }}>
          <p>{error || "This product could not be found."}</p>
          <Link className="btn btn-gold" to="/">Back to the collection</Link>
        </div>
      </div>
    );
  }

  const baseImg = design ? design.img : product.img;
  const storeImg = STORE_IMAGE[product.id] || "display-main";
  const productShotSrc = design ? imgUrl(baseImg, "circ") : imgUrl(baseImg);
  const thumbs = [
    { key: "product", label: "Product", src: productShotSrc },
    { key: "sheet", label: "Details", src: (design && design.sheet) ? imgUrl(design.sheet) : imgUrl(`${product.img}-sheet`) },
    { key: "store", label: "In store", src: imgUrl(storeImg) }
  ];
  const mainImg = thumbs[activeThumb].src;

  function handleAdd() {
    addToCart(product.id, { variant: variantId, design: designId, qty });
  }

  function handleBuyNow() {
    addToCart(product.id, { variant: variantId, design: designId, qty });
    navigate("/checkout");
  }

  const BASE_URL = import.meta.env.VITE_SITE_URL || "https://sonicprints.shop";
  const seoImage = productShotSrc.startsWith("http") ? productShotSrc : `${BASE_URL}${productShotSrc}`;
  const seoTitle = `${product.name} (${product.subtitle || "Ganesh Puja Kit 2026"}) — Buy Online ₹${unitPrice} | Sonic Prints`;
  const seoDesc = `${product.shortDescription || product.kitDescription} Natural eco-friendly clay idol, complete puja essentials & doorstep delivery. Order online now!`;
  const seoKeywords = `${product.name}, ${product.subtitle}, Ganesh Chaturthi 2026, Eco friendly Ganesh idol, clay ganesha online, buy ${product.name} online, ganesh puja kit india`;

  const productSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${BASE_URL}/kit/${product.slug}#product`,
        "name": `${product.name} — ${product.subtitle || "Ganesh Festival Kit 2026"}`,
        "image": seoImage,
        "description": seoDesc,
        "sku": `SP-2026-${product.id.toUpperCase()}`,
        "mpn": `SP2026${product.id}`,
        "brand": {
          "@type": "Brand",
          "name": "Sonic Prints"
        },
        "offers": {
          "@type": "Offer",
          "url": `${BASE_URL}/kit/${product.slug}`,
          "priceCurrency": "INR",
          "price": unitPrice,
          "priceValidUntil": "2026-09-30",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Sonic Prints"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${BASE_URL}/kit/${product.slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": BASE_URL
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Ganesh Festival Collection 2026",
            "item": `${BASE_URL}/#kits`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": `${BASE_URL}/kit/${product.slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="page">
      <SEOHead
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        image={seoImage}
        canonical={`/kit/${product.slug}`}
        type="product"
        schema={productSchema}
      />

      <div className="wrap pd" style={{ paddingTop: 28 }}>
        {/* Product Gallery Viewport */}
        <div className="gal">
          <div className="gal-viewport-wrapper">
            <motion.div
              className="thumbs-v"
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: EASE_SILK }}
            >
              {thumbs.map((t, i) => (
                <button
                  key={t.key}
                  className={i === activeThumb ? "on" : ""}
                  aria-label={t.label}
                  onClick={() => setActiveThumb(i)}
                >
                  <img src={t.src} alt={t.label} loading="lazy" decoding="async" />
                </button>
              ))}
            </motion.div>

            <motion.div
              className="gal-main"
              ref={galRef}
              initial={reduced ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: EASE_SILK }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={mainImg}
                  src={mainImg}
                  alt={`${product.name} — ${product.subtitle}`}
                  width="900"
                  height="900"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  initial={reduced ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_SILK }}
                  onLoad={() => registerTarget(galRef.current)}
                />
              </AnimatePresence>
              {product.badge && <span className="zoomtag">{product.badge}</span>}
            </motion.div>
          </div>
        </div>

        {/* Product Purchase Actions & Info */}
        <motion.div
          className="buy"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: reduced ? 0 : 0.12 } } }}
        >
          <motion.span className="sku-badge" variants={FADE_IN}>SKU: {product.sku || "GLAJ11171"}</motion.span>
          <motion.div className="sub" variants={FADE_IN}>{product.subtitle}</motion.div>
          <motion.h1 variants={FADE_IN}>{product.name}</motion.h1>
          {product.tag && <motion.p className="tag" variants={FADE_IN}>“{product.tag}”</motion.p>}
          <motion.p className="short" variants={FADE_IN}>{product.shortDescription}</motion.p>
          <motion.div className="priceline" variants={FADE_IN}>
            <span className="now">{money(unitPrice)}</span>
            <span className="inc">inclusive of taxes · delivery calculated at checkout</span>
          </motion.div>

          {!!product.variants?.length && (
            <motion.div className="opt" variants={FADE_IN}>
              <label>Choose a size</label>
              <div className="optrow">
                {product.variants.map((v) => (
                  <button key={v.id} className={`optbtn${v.id === variantId ? " on" : ""}`} onClick={() => setVariantId(v.id)}>
                    <b>{v.name}</b><span>{money(v.price)}</span>
                  </button>
                ))}
              </div>
              <p className="optnote">{variant?.note}</p>
            </motion.div>
          )}

          {!!product.designs?.length && (
            <motion.div className="opt" variants={FADE_IN}>
              <label>Choose a design</label>
              <div className="optrow">
                {product.designs.map((d) => (
                  <button key={d.id} className={`optbtn${d.id === designId ? " on" : ""}`} style={{ minWidth: "auto" }} onClick={() => { setDesignId(d.id); setActiveThumb(0); }}>
                    <b>{d.name}</b>
                  </button>
                ))}
              </div>
              <p className="optnote">{design?.note}</p>
            </motion.div>
          )}

          <motion.div className="buyrow" variants={FADE_IN}>
            <div className="qbig">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={qty}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button className="btn btn-gold btn-lg" style={{ flex: 1 }} onClick={handleAdd}>
              <Icon name="cart" size={20} /> Add to cart
            </button>
            <button className="btn btn-lg" onClick={handleBuyNow}>Buy now</button>
          </motion.div>
          
          <Link to="/bulk" className="btn btn-line btn-wide">
            Need 25 or more? Get bulk pricing <Icon name="arrow" />
          </Link>

          {!!product.highlights?.length && (
            <motion.div className="hl" variants={FADE_IN}>
              {product.highlights.map((h) => (
                <div key={h.title}><b>{h.title}</b><span>{h.text}</span></div>
              ))}
            </motion.div>
          )}

          <motion.div className="assure" variants={FADE_IN}>
            {ASSURE_BULLETS.map((a) => (
              <div key={a.title}><Icon name="check" /><span><b>{a.title}</b> — {a.text}</span></div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* About The Product & Product-Specific Advantages Section */}
      <section className="pd-sec" style={{ background: "#ffffff", padding: "60px 0" }}>
        <div className="wrap">
          <div className="two">
            <div className="rv">
              <div className="eyebrow">About The Product</div>
              <h2>{product.name} — {product.subtitle}</h2>
              <div className="pd-lede" style={{ marginTop: 16 }}>
                <p>
                  {product.shortDescription || product.kitDescription}
                </p>
                {product.ledeParagraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {product.bestFor && (
                  <p style={{ fontSize: 13.5, color: "var(--muted)", borderTop: "1px dashed var(--line)", paddingTop: 14, marginTop: 20 }}>
                    <strong style={{ color: "var(--ink)" }}>Best for:</strong> {product.bestFor}
                  </p>
                )}
              </div>
            </div>

            {/* Why Choose This Product? (Product-Specific Advantages Grid) */}
            <div className="rv rv-d1">
              <div className="eyebrow">Why Choose {product.name}?</div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16 }}>Key Advantages &amp; Useful Highlights</h3>
              <div className="advantages-grid">
                {product.highlights?.map((h, idx) => (
                  <div className="adv-card" key={h.title || idx}>
                    <div className="adv-icon">{idx === 0 ? "🌟" : idx === 1 ? "📦" : idx === 2 ? "🌿" : "✨"}</div>
                    <div className="adv-title">{h.title}</div>
                    <div className="adv-desc">{h.text}</div>
                  </div>
                ))}
                {(!product.highlights || product.highlights.length === 0) && (
                  <>
                    <div className="adv-card">
                      <div className="adv-icon">🌟</div>
                      <div className="adv-title">Premium Craftsmanship</div>
                      <div className="adv-desc">Thoughtfully designed and crafted for an elevated festive and spiritual experience.</div>
                    </div>
                    <div className="adv-card">
                      <div className="adv-icon">📦</div>
                      <div className="adv-title">Complete Setup</div>
                      <div className="adv-desc">Includes everything needed for immediate use with clear step-by-step guidance.</div>
                    </div>
                    <div className="adv-card">
                      <div className="adv-icon">🌿</div>
                      <div className="adv-title">Eco-Friendly &amp; Safe</div>
                      <div className="adv-desc">100% natural, eco-conscious materials that are safe for your home and family.</div>
                    </div>
                    <div className="adv-card">
                      <div className="adv-icon">✨</div>
                      <div className="adv-title">Guaranteed Quality</div>
                      <div className="adv-desc">Backed by Sonic Prints quality assurance and dedicated customer support.</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Shipping, Returns & Customer Policy Section */}
      <section className="sec" style={{ paddingTop: 0, paddingBottom: 16 }}>
        <div className="wrap">
          <div className="policy-section">
            <div className="sec-head">
              <div className="eyebrow">Customer Protection &amp; Guarantees</div>
              <h2>Shipping, Returns &amp; Customer Support</h2>
              <p>Transparent, flexible, and customer-friendly policies for complete peace of mind.</p>
            </div>

            {/* Policy Accordion Tabs */}
            <div className="policy-tabs-header">
              <button className={`policy-tab-btn ${activePolicyTab === "returns" ? "active" : ""}`} onClick={() => setActivePolicyTab("returns")}>
                🔄 Returns &amp; Replacements
              </button>
              <button className={`policy-tab-btn ${activePolicyTab === "shipping" ? "active" : ""}`} onClick={() => setActivePolicyTab("shipping")}>
                🚚 Shipping &amp; Delivery
              </button>
            </div>

            <div className="policy-tab-content">
              {activePolicyTab === "returns" && (
                <div>
                  <div className="policy-subhead">Our Customer-Friendly Return Terms:</div>
                  <ul>
                    <li><strong>Wrong Product:</strong> If the product received does not match your order (Unboxing Video Required).</li>
                    <li><strong>Manufacturing Defect:</strong> If there is a manufacturing defect on the received item (Video Required).</li>
                    <li><strong>Damaged Condition:</strong> Received in a damaged state in transit (Unboxing Video Required within 12 hours).</li>
                  </ul>

                  <div className="policy-subhead">Order Cancellation &amp; Process:</div>
                  <p>
                    In case you wish to cancel an order, please email us at <strong>{config?.email || "branforgeagency@gmail.com"}</strong> within 12 hours of placing your order. Same-day / fixed-time categories cannot be cancelled once dispatched.
                  </p>

                  <div className="policy-subhead">Return Freight / Shipping Costs:</div>
                  <table className="policy-table">
                    <thead>
                      <tr><th>Weight Slab (Domestic India)</th><th>Deducted Freight Amount</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>0 – 500 gm</td><td>Rs. 75/-</td></tr>
                      <tr><td>500 – 999 gm</td><td>Rs. 150/-</td></tr>
                      <tr><td>1 Kg – 2 Kg</td><td>Rs. 250/-</td></tr>
                      <tr><td>Above 2 Kg</td><td>Rs. 250/- + Rs. 125 per additional KG</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activePolicyTab === "shipping" && (
                <div>
                  <div className="policy-subhead">Order Processing &amp; Dispatch:</div>
                  <p>
                    All orders placed before <strong>12:00 PM (Monday to Saturday)</strong> are processed and dispatched the same day. Orders placed after 12:00 PM or during weekends / public holidays are dispatched on the next business day.
                  </p>

                  <div className="policy-subhead">International Shipping:</div>
                  <p>
                    For international orders, we ship via <strong>DHL Express</strong> with expected delivery in <strong>5–7 working days</strong> across the globe (subject to customs clearance). International packages may be subject to local import duties and taxes, which are paid by the recipient.
                  </p>

                  <div className="policy-subhead">Order Tracking:</div>
                  <p>
                    Once your package is dispatched, a confirmation email and SMS with tracking information will be sent so you can track your shipment directly.
                  </p>
                </div>
              )}
            </div>

            {/* Support Footer Card */}
            <div className="support-footer-card">
              <div className="support-footer-info">
                <h4>SONIC PRINTS PRIVATE LIMITED</h4>
                <p>{config?.address || "Sonic Prints, Coimbatore, Tamil Nadu, India"} · Country of Origin: INDIA</p>
                <p style={{ marginTop: 4 }}>Customer Support: Call / WhatsApp: {config?.whatsapp || "+91 93845 56755"} (10:00 AM – 6:00 PM IST Mon–Sat)</p>
              </div>

              <a href={`https://wa.me/${(config?.whatsapp || "+91 93845 56755").replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="support-action-btn">
                💬 Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications & Volume Pricing */}
      {(!!product.specs?.length || !!product.bulkPricing?.length) && (
        <section className="sec" style={{ paddingTop: 16 }}>
          <div className="wrap two">
            {!!product.specs?.length && (
              <div className="rv">
                <div className="eyebrow">Specifications</div>
                <h2 style={{ marginBottom: 20 }}>The details</h2>
                <table className="tbl"><tbody>
                  {product.specs.map((s) => <tr key={s.label}><td>{s.label}</td><td>{s.value}</td></tr>)}
                </tbody></table>
              </div>
            )}
            {!!product.bulkPricing?.length && (
              <div className="rv rv-d1">
                <div className="eyebrow">Bulk &amp; trade pricing</div>
                <h2 style={{ marginBottom: 20 }}>Buying in volume</h2>
                <table className="tbl">
                  <thead><tr><th>Order size</th><th className="num">Per unit</th><th className="num">You save</th></tr></thead>
                  <tbody>
                    {product.bulkPricing.map((t) => (
                      <tr key={t.range}><td>{t.range}</td><td className="num">{money(t.price)}</td><td className="num">{t.savingsLabel}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>
                  Indicative slab pricing, excluding GST and freight, for standard specification.
                </p>
                <div style={{ marginTop: 16 }}><Link to="/bulk" className="btn btn-gold">Request a rate card</Link></div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Cross-Sell Recommendations */}
      {!!crossSell.length && (
        <section className="sec sec-cream">
          <div className="wrap">
            <div className="sec-head-row">
              <div className="sec-head rv"><div className="eyebrow">Complete the celebration</div><h2>Goes well with</h2></div>
            </div>
            <RevealGroup className="store-grid-showcase" stagger={0.12} amount={0.1}>
              {crossSell.map((p, i) => <KitCard key={p.id} product={p} index={i} />)}
            </RevealGroup>
          </div>
        </section>
      )}
    </div>
  );
}
