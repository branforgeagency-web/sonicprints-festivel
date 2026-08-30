/**
 * Express middleware for custom 301 (Permanent) redirects.
 * Handles legacy URLs and redirects them to the canonical routes.
 */
const REDIRECT_MAP = {
  "/shop": "/",
  "/store": "/",
  "/collection": "/",
  "/corporate": "/bulk",
  "/corporate-gifting": "/bulk",
  "/b2b": "/bulk",
  "/kids": "/kit/bal-ganesh-kids-kit",
  "/mini": "/kit/shubharambh-mini",
  "/employee": "/kit/employee-puja-box",
  "/diy": "/kit/make-your-own-ganesha",
  "/mandap": "/kit/gruha-ganapathi-mandap",
  "/chakra": "/kit/rotating-chakra-backdrop",
  "/products": "/",
  "/kits": "/"
};

export function customRedirects(req, res, next) {
  const path = req.path.toLowerCase().replace(/\/$/, ""); // trim trailing slash

  // Exact match redirect
  if (REDIRECT_MAP[path]) {
    return res.redirect(301, REDIRECT_MAP[path]);
  }

  // Dynamic pattern match e.g. /products/:slug or /kits/:slug -> /kit/:slug
  const legacyMatch = path.match(/^\/(?:products|kits|product)\/([a-z0-9-]+)$/i);
  if (legacyMatch) {
    const slug = legacyMatch[1];
    return res.redirect(301, `/kit/${slug}`);
  }

  next();
}
