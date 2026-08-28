import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { imgUrl, money } from "../context/SiteContext.jsx";
import Icon from "./Icon.jsx";
import { useProductTransition } from "./fx/ProductTransition.jsx";
import { VARIANTS, REDUCED, EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";

// These two kits get the warmer "kids" accent colour on their badge/price (see .kit.kids in site.css).
const KIDS_PRODUCT_IDS = ["kids", "diy"];

export default function KitCard({ product, revealClass = "", index = 0 }) {
  const { addToCart } = useCart();
  const { begin } = useProductTransition();
  const { reduced } = useMotionProfile();
  const imgRef = useRef(null);

  const priceLabel = product.variants?.length ? `From ${money(product.price)}` : money(product.price);
  const priceSub = product.variants?.length ? "Starting price" : "All inclusive";
  const isKids = KIDS_PRODUCT_IDS.includes(product.id);

  /* Hand the photo to the detail-reveal overlay, then let the link navigate. */
  function openProduct() {
    begin(imgRef.current, product.name);
  }

  return (
    <motion.article
      className={`kit${isKids ? " kids" : ""}${revealClass ? ` ${revealClass}` : ""}`}
      variants={reduced ? REDUCED : VARIANTS.cardIn}
      transition={{ duration: 0.75, ease: EASE_SILK }}
      whileHover={reduced ? undefined : { y: -10 }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
      style={{ willChange: "transform" }}
    >
      <Link
        className="kit-img"
        to={`/kit/${product.slug}`}
        onClick={openProduct}
        data-cursor="view"
        data-cursor-label={`View ${product.name}`}
      >
        <img
          ref={imgRef}
          src={imgUrl(product.img)}
          alt={`${product.name} — ${product.subtitle}`}
          loading="lazy"
          width="900"
          height="765"
          className="kit-img-zoom"
        />
        {product.badge && <span className="kit-badge">{product.badge}</span>}
        {isKids && <span className="kit-kids-sparkle-tag">✨ Bappa Approved 🎨</span>}
        <span className="kit-hint" aria-hidden="true">
          View details
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>

      <div className="kit-body">
        <div className="kit-sub">{product.subtitle}</div>
        <h3><Link to={`/kit/${product.slug}`} onClick={openProduct}>{product.name}</Link></h3>
        <p className="kit-desc">{product.kitDescription || product.shortDescription}</p>
        <div className="kit-who">{product.kitWho}</div>
        <div className="kit-foot">
          <div className="kit-price"><b>{priceLabel}</b><span>{priceSub}</span></div>
          <div className="kit-acts">
            <Link
              className="iconbtn"
              to={`/kit/${product.slug}`}
              onClick={openProduct}
              aria-label={`View ${product.name}`}
              title="View details"
            >
              <Icon name="eye" />
            </Link>
            <button
              className="iconbtn"
              onClick={() => addToCart(product.id, { qty: 1 })}
              aria-label={`Add ${product.name} to cart`}
              title="Add to cart"
            >
              <Icon name="plus" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
