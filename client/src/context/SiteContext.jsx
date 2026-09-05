import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { getProducts, getSiteConfig } from "../api/client.js";
import { FALLBACK_PRODUCTS } from "../data/products.js";
import { assetUrl } from "../utils/assetHelper.js";

export { assetUrl };

const SiteContext = createContext(null);

const DEFAULT_CONFIG = {
  whatsapp: "+91 93845 56755",
  phone: "+91 93845 56755",
  phoneHref: "+91 93845 56755",
  email: "branforgeagency@gmail.com",
  city: "Coimbatore, Tamil Nadu",
  address: "Sonic Prints, Coimbatore, Tamil Nadu, India",
  instagram: "https://www.instagram.com/sonicprints.in",
  currency: "INR",
  freeShipAbove: 1499,
  shipFlat: 79,
  bulkThreshold: 25,
  cashfreeAppId: "",
  cashfreeMode: "sandbox",
  razorpayKeyId: "",
  festivalDateISO: "2026-09-14T06:00:00+05:30",
  orderCutoffLabel: "Order by 6 Sept for guaranteed pre-festival delivery"
};

export function money(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function imgUrl(key, size) {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("data:")) return key;
  if (key.startsWith("/")) return assetUrl(key);
  const cleanKey = key.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  const name = size ? `${cleanKey}-${size}` : cleanKey;
  return assetUrl(`/assets/img/${name}.jpg`);
}

// A handful of large, rarely-changing marketing images (the hero banner) also
// ship a hand-generated .webp alongside the original .jpg — this returns that
// path for use as a <picture> source, with the .jpg from imgUrl() as fallback.
// Not used for product photos, since those are admin-uploaded as .jpg only
// and a hardcoded .webp path would 404 for anything the admin adds later.
export function imgUrlWebp(key, size) {
  const jpg = imgUrl(key, size);
  return jpg ? jpg.replace(/\.jpg$/i, ".webp") : jpg;
}

export function SiteProvider({ children }) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cfg] = await Promise.all([
        getProducts().catch(() => FALLBACK_PRODUCTS),
        getSiteConfig().catch(() => ({}))
      ]);
      setProducts(prods && prods.length ? prods : FALLBACK_PRODUCTS);
      setConfig({ ...DEFAULT_CONFIG, ...(cfg || {}) });
    } catch (err) {
      console.error("Failed to load storefront data", err);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const productById = useCallback((id) => products.find((p) => p.id === id), [products]);
  const productBySlug = useCallback((slug) => products.find((p) => p.slug === slug), [products]);

  const value = useMemo(
    () => ({ products, config, loading, error, reload: load, productById, productBySlug }),
    [products, config, loading, error, load, productById, productBySlug]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
