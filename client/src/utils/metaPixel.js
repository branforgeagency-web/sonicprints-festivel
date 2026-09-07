/**
 * Meta (Facebook) Pixel Helper for Sonic Prints
 * Tracks standard e-commerce funnel events:
 * 1. ViewContent (Product detail page)
 * 2. AddToCart (Cart addition success)
 * 3. InitiateCheckout (Checkout started)
 * 4. Purchase (Payment / order confirmed)
 */

function trackMetaEvent(eventName, payload) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, payload);
    if (import.meta.env?.DEV) {
      console.log(`[Meta Pixel] fbq('track', '${eventName}')`, payload);
    }
  } else if (import.meta.env?.DEV) {
    console.warn(`[Meta Pixel] window.fbq unavailable. Event skipped: ${eventName}`, payload);
  }
}

/**
 * 1. ViewContent — Product page
 * Fired when a customer opens a product detail page.
 */
export const viewContent = (product) => {
  if (!product) return;
  const productId = product._id || product.id;
  trackMetaEvent("ViewContent", {
    content_ids: [String(productId)],
    content_name: product.name,
    content_type: "product",
    value: Number(product.price || 0),
    currency: "INR"
  });
};

/**
 * 2. AddToCart — Add to Cart action
 * Fired only after product has actually been added to the cart.
 */
export const addToCart = (product, value = null) => {
  if (!product) return;
  const productId = product._id || product.id;
  trackMetaEvent("AddToCart", {
    content_ids: [String(productId)],
    content_name: product.name,
    content_type: "product",
    value: Number(value !== null && value !== undefined ? value : (product.price || 0)),
    currency: "INR"
  });
};

/**
 * 3. InitiateCheckout — Checkout start
 * Fired when customer proceeds to checkout. Includes deduplication guard.
 */
let lastInitiateTime = 0;
export const initiateCheckout = (cartItems, total) => {
  if (!cartItems || !cartItems.length) return;
  
  // Guard against duplicate triggers within 2.5 seconds (e.g. button click + checkout mount)
  const now = Date.now();
  if (now - lastInitiateTime < 2500) return;
  lastInitiateTime = now;

  const contentIds = cartItems
    .map((item) => item.productId || item._id || item.id)
    .filter(Boolean)
    .map(String);

  trackMetaEvent("InitiateCheckout", {
    content_ids: contentIds,
    content_type: "product",
    value: Number(total || 0),
    currency: "INR"
  });
};

/**
 * 4. Purchase — Order / Payment success
 * Fired only after payment / order is successfully completed.
 */
export const purchase = (order) => {
  if (!order) return;
  const items = Array.isArray(order.items) ? order.items : [];
  const contentIds = items
    .map((item) => item.productId || item._id || item.id)
    .filter(Boolean)
    .map(String);

  trackMetaEvent("Purchase", {
    content_ids: contentIds.length ? contentIds : (order.orderId ? [String(order.orderId)] : []),
    content_type: "product",
    value: Number(order.total || 0),
    currency: "INR"
  });
};

export default {
  viewContent,
  addToCart,
  initiateCheckout,
  purchase
};
