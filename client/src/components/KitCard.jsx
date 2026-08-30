import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext.jsx";
import { imgUrl, money } from "../context/SiteContext.jsx";
import Icon from "./Icon.jsx";
import { useProductTransition } from "./fx/ProductTransition.jsx";
import { VARIANTS, REDUCED, EASE_SILK } from "../anim/tokens.js";
import useMotionProfile from "../anim/useMotionProfile.js";

const KIDS_PRODUCT_IDS = ["kids", "diy"];

export default function KitCard({ product, revealClass = "", index = 0, variant = "tile" }) {
  const { addToCart } = useCart();
  const { begin } = useProductTransition();
  const { reduced } = useMotionProfile();
  const imgRef = useRef(null);

  const priceLabel = product.variants?.length ? `From ${money(product.price)}` : money(product.price);
  const priceSub = product.variants?.length ? "Starting price" : "All inclusive";
  const isKids = KIDS_PRODUCT_IDS.includes(product.id);

  function openProduct() {
    begin(imgRef.current, product.name);
  }

  const highlightPills = product.highlights?.slice(0, 3) || [];

  /* --- Variant 1: Table Row View --- */
  if (variant === "table") {
    return (
      <motion.article
        className={`kit-row-item${isKids ? " is-kids" : ""}${revealClass ? ` ${revealClass}` : ""}`}
        variants={reduced ? REDUCED : VARIANTS.cardIn}
        transition={{ duration: 0.4, ease: EASE_SILK }}
      >
        <Link
          className="kri-img-link"
          to={`/kit/${product.slug}`}
          onClick={openProduct}
          aria-label={`View details for ${product.name}`}
        >
          <img
            ref={imgRef}
            src={imgUrl(product.img)}
            alt={product.name}
            loading="lazy"
            className="kri-img"
          />
        </Link>
        <div className="kri-info">
          <div className="kri-head">
            <span className="kri-subtitle">{product.subtitle}</span>
            <h4 className="kri-title">
              <Link to={`/kit/${product.slug}`} onClick={openProduct}>
                {product.name}
              </Link>
            </h4>
          </div>
          <p className="kri-desc">{product.shortDescription || product.kitDescription}</p>
        </div>
        <div className="kri-who-pill">{product.kitWho}</div>
        <div className="kri-price-block">
          <span className="kri-price">{priceLabel}</span>
          <span className="kri-sub">{priceSub}</span>
        </div>
        <div className="kri-actions">
          <Link to={`/kit/${product.slug}`} onClick={openProduct} className="kcm-btn kcm-btn-outline">
            View
          </Link>
          <button
            onClick={() => addToCart(product.id, { qty: 1 })}
            className="kcm-btn kcm-btn-primary"
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name="cart" size={14} /> Add
          </button>
        </div>
      </motion.article>
    );
  }

  /* --- Variant 2: Bento Hero Spotlight View --- */
  if (variant === "hero") {
    return (
      <motion.article
        className={`kit-bento-hero${isKids ? " is-kids" : ""}${revealClass ? ` ${revealClass}` : ""}`}
        variants={reduced ? REDUCED : VARIANTS.cardIn}
        transition={{ duration: 0.6, ease: EASE_SILK }}
        whileHover={reduced ? undefined : { y: -6 }}
      >
        <Link
          className="kbh-img-wrapper"
          to={`/kit/${product.slug}`}
          onClick={openProduct}
          aria-label={`View details for ${product.name}`}
        >
          <img
            ref={imgRef}
            src={imgUrl(product.img)}
            alt={`${product.name} — ${product.subtitle}`}
            loading="lazy"
            className="kbh-img"
          />
          <div className="kcm-badges">
            <span className="kcm-badge kcm-badge-featured">🌟 Featured Kit</span>
            {product.badge && <span className="kcm-badge">{product.badge}</span>}
            {isKids && <span className="kcm-badge kcm-badge-kids">✨ Bappa Approved</span>}
          </div>
        </Link>

        <div className="kbh-content">
          <div className="kbh-header">
            <span className="kcm-subtitle">{product.subtitle}</span>
            <h3 className="kbh-title">
              <Link to={`/kit/${product.slug}`} onClick={openProduct}>
                {product.name}
              </Link>
            </h3>
          </div>

          <p className="kbh-desc">{product.kitDescription || product.shortDescription}</p>

          {!!highlightPills.length && (
            <div className="kcm-pills">
              {highlightPills.map((h) => (
                <span key={h.title} className="kcm-pill">
                  ✦ {h.title}
                </span>
              ))}
            </div>
          )}

          <div className="kcm-who">Ideal for: {product.kitWho}</div>

          <div className="kbh-footer">
            <div className="kcm-price-block">
              <span className="kcm-price-amount">{priceLabel}</span>
              <span className="kcm-price-label">{priceSub}</span>
            </div>
            <div className="kcm-actions">
              <Link to={`/kit/${product.slug}`} onClick={openProduct} className="kcm-btn kcm-btn-outline">
                Explore Kit <Icon name="arrow" size={14} />
              </Link>
              <button
                onClick={() => addToCart(product.id, { qty: 1 })}
                className="kcm-btn kcm-btn-primary"
                aria-label={`Add ${product.name} to cart`}
              >
                <Icon name="cart" size={15} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  /* --- Variant 3: Default Bento Tile View --- */
  return (
    <motion.article
      className={`kit-card-modern${isKids ? " is-kids" : ""}${revealClass ? ` ${revealClass}` : ""}`}
      variants={reduced ? REDUCED : VARIANTS.cardIn}
      transition={{ duration: 0.6, ease: EASE_SILK }}
      whileHover={reduced ? undefined : { y: -8 }}
    >
      {/* Top Image Showcase with Badges */}
      <Link
        className="kcm-img-wrapper"
        to={`/kit/${product.slug}`}
        onClick={openProduct}
        aria-label={`View details for ${product.name}`}
      >
        <img
          ref={imgRef}
          src={imgUrl(product.img)}
          alt={`${product.name} — ${product.subtitle}`}
          loading="lazy"
          width="900"
          height="765"
          className="kcm-img"
        />
        <div className="kcm-badges">
          {product.badge && <span className="kcm-badge">{product.badge}</span>}
          {isKids && <span className="kcm-badge kcm-badge-kids">✨ Bappa Approved</span>}
        </div>
      </Link>

      {/* Content Body */}
      <div className="kcm-content">
        <div className="kcm-subtitle">{product.subtitle}</div>
        <h3 className="kcm-title">
          <Link to={`/kit/${product.slug}`} onClick={openProduct}>
            {product.name}
          </Link>
        </h3>
        
        <p className="kcm-description">
          {product.kitDescription || product.shortDescription}
        </p>

        {/* Feature Pills */}
        {!!highlightPills.length && (
          <div className="kcm-pills">
            {highlightPills.map((h) => (
              <span key={h.title} className="kcm-pill">
                ✦ {h.title}
              </span>
            ))}
          </div>
        )}

        <div className="kcm-who">Ideal for: {product.kitWho}</div>

        {/* Price & Action Footer */}
        <div className="kcm-footer">
          <div className="kcm-price-block">
            <span className="kcm-price-amount">{priceLabel}</span>
            <span className="kcm-price-label">{priceSub}</span>
          </div>

          <div className="kcm-actions">
            <Link
              to={`/kit/${product.slug}`}
              onClick={openProduct}
              className="kcm-btn kcm-btn-outline"
              title="View details"
            >
              View
            </Link>
            <button
              onClick={() => addToCart(product.id, { qty: 1 })}
              className="kcm-btn kcm-btn-primary"
              aria-label={`Add ${product.name} to cart`}
              title="Add to cart"
            >
              <Icon name="cart" size={15} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
