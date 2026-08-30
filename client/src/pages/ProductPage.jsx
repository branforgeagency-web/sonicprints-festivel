import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getProductBySlug } from "../api/client.js";
import { imgUrl, money } from "../context/SiteContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import useReveal from "../hooks/useReveal.js";
import KitCard from "../components/KitCard.jsx";
import Icon from "../components/Icon.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, RevealGroup } from "../components/fx/Reveal.jsx";
import { useProductTransition } from "../components/fx/ProductTransition.jsx";
import { EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";

// The original site's "in store" lifestyle photo differs by category.
const STORE_IMAGE = { chakra: "display-chakra", kids: "display-kids", diy: "display-kids" };

const FADE_IN = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_SILK } } };

const ASSURE_BULLETS = [
  { title: "Natural clay idol", text: "no plaster of Paris, no thermocol, safe for home visarjan." },
  { title: "Sealed prasadam", text: "from an FSSAI-licensed supplier, with licence number and best-before printed on pack." },
  { title: "Pre-festival delivery", text: "across Tamil Nadu, Andhra Pradesh, Telangana, Karnataka and Maharashtra." },
  { title: "Custom branding available", text: "on sleeves, cards and certificates — never on the idol." }
];

export default function ProductPage() {
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
      .catch(() => !cancelled && setError("This kit could not be found."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  /* Tell the detail-reveal overlay exactly where this gallery landed, so
     the photo that lifted off the card finishes its flight in the right
     place rather than at a guessed position. */
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
          <span>Loading kit details…</span>
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="page">
        <div className="wrap" style={{ padding: "60px 0" }}>
          <p>{error || "This kit could not be found."}</p>
          <Link className="btn btn-gold" to="/">Back to the collection</Link>
        </div>
      </div>
    );
  }

  const baseImg = design ? design.img : product.img;
  const storeImg = STORE_IMAGE[product.id] || "display-main";
  // Only the rotating-chakra designs have a "-circ" (cropped circular) rendition;
  // every other product's gallery uses its plain full-size photo.
  const productShotSrc = design ? imgUrl(baseImg, "circ") : imgUrl(baseImg);
  const thumbs = [
    { key: "product", label: "Product", src: productShotSrc },
    { key: "sheet", label: "Details", src: design ? imgUrl(design.sheet) : imgUrl(`${product.img}-sheet`) },
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

  return (
    <div className="page">
      <div className="wrap crumb">
        <Link to="/">Home</Link><span>›</span>
        <Link to="/#kits">The Collection</Link><span>›</span>{product.name}
      </div>

      <div className="wrap pd">
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
                  <img src={t.src} alt={t.label} />
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

        <motion.div
          className="buy"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: reduced ? 0 : 0.12 } } }}
        >
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

      {!!product.ledeParagraphs?.length && (
        <section className="pd-sec">
          <div className="wrap">
            <div className="two">
              <div className="rv">
                <div className="eyebrow">Why this kit exists</div>
                <h2>{product.whyHeadline || product.tag}</h2>
                <div className="pd-lede" style={{ marginTop: 16 }}>
                  {product.ledeParagraphs.map((p, i) => <p key={i}>{p}</p>)}
                </div>
                {product.bestFor && (
                  <p style={{ fontSize: 13.5, color: "var(--muted)", borderTop: "1px dashed var(--line)", paddingTop: 14, marginTop: 20 }}>
                    <strong style={{ color: "var(--ink)" }}>Best for:</strong> {product.bestFor}
                  </p>
                )}
              </div>
              <div className="rv rv-d1">
                <div className="sheetimg">
                  <img src={design ? imgUrl(design.sheet) : imgUrl(`${product.img}-sheet`)} alt={`${product.name} full specification sheet`} loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!!product.contents?.length && (
        <section className="sec sec-cream">
          <div className="wrap">
            <div className="sec-head rv">
              <div className="eyebrow">Inside the box</div>
              <h2>{product.contents.length} components. Nothing else to buy.</h2>
              <p>Every item is placed in its own compartment, in the order you need it.</p>
            </div>
            <div className="contents rv">
              {product.contents.map((c, i) => (
                <div className="citem" key={i}><i>{i + 1}</i><span>{c}</span></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!product.processSteps?.steps?.length && (
        <section className="sec sec-cream">
          <div className="wrap">
            <div className="sec-head rv">
              <div className="eyebrow">{product.processSteps.eyebrow}</div>
              <h2>{product.processSteps.headline}</h2>
            </div>
            <div className="stepgrid">
              {product.processSteps.steps.map((s, i) => (
                <div className={`sg rv rv-d${i % 3}`} key={s.title}>
                  <div className="n">{i + 1}</div><h4>{s.title}</h4><p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(!!product.specs?.length || !!product.bulkPricing?.length) && (
        <section className="sec">
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
                  Indicative slab pricing, excluding GST and freight, for standard specification. Branded sleeves,
                  personalisation and premium prasadam are quoted separately. Final rates are confirmed after sample approval.
                </p>
                <div style={{ marginTop: 16 }}><Link to="/bulk" className="btn btn-gold">Request a rate card</Link></div>
              </div>
            )}
          </div>
        </section>
      )}

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
