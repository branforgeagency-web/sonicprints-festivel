import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSite, imgUrl } from "./SiteContext.jsx";
import { useToast } from "./ToastContext.jsx";

const CartContext = createContext(null);
const STORAGE_KEY = "sonicprints_cart_v1";

function readStoredCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function keyOf(id, v, d) {
  return [id, v || "", d || ""].join("|");
}

export function CartProvider({ children }) {
  const { config, productById } = useSite();
  const toast = useToast();
  const [cart, setCart] = useState(readStoredCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const findVariant = useCallback((product, vid) => {
    if (!product?.variants?.length) return null;
    return product.variants.find((v) => v.id === vid) || product.variants[0];
  }, []);
  const findDesign = useCallback((product, did) => {
    if (!product?.designs?.length) return null;
    return product.designs.find((d) => d.id === did) || product.designs[0];
  }, []);

  const unitPrice = useCallback(
    (id, variant) => {
      const p = productById(id);
      if (!p) return 0;
      const v = findVariant(p, variant);
      return v ? v.price : p.price;
    },
    [productById, findVariant]
  );

  const lineLabel = useCallback(
    (item) => {
      const p = productById(item.id);
      if (!p) return "";
      const bits = [];
      if (p.designs?.length) {
        const d = findDesign(p, item.design);
        if (d) bits.push(d.name);
      }
      if (p.variants?.length) {
        const v = findVariant(p, item.variant);
        if (v) bits.push(v.name);
      }
      return bits.join(" · ");
    },
    [productById, findDesign, findVariant]
  );

  const lineImage = useCallback(
    (item) => {
      const p = productById(item.id);
      if (!p) return "";
      let img = p.img;
      if (p.designs?.length) {
        const d = findDesign(p, item.design);
        if (d) img = d.img;
      }
      return imgUrl(img, "sm");
    },
    [productById, findDesign]
  );

  const addToCart = useCallback(
    (id, opts = {}) => {
      const p = productById(id);
      if (!p) return;
      const variant = p.variants?.length ? opts.variant || p.variants[0].id : null;
      const design = p.designs?.length ? opts.design || p.designs[0].id : null;
      const qty = Math.max(1, parseInt(opts.qty, 10) || 1);
      const k = keyOf(id, variant, design);

      setCart((prev) => {
        const idx = prev.findIndex((it) => keyOf(it.id, it.variant, it.design) === k);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { id, variant, design, qty }];
      });

      // Let the shopper know exactly which size/design was added, since a
      // quick "+" tap on the homepage/product cards defaults to the first
      // option rather than making them choose one.
      const bits = [];
      if (p.designs?.length) {
        const d = findDesign(p, design);
        if (d) bits.push(d.name);
      }
      if (p.variants?.length) {
        const v = findVariant(p, variant);
        if (v) bits.push(v.name);
      }
      const label = bits.join(" · ");
      toast(`Added — ${p.name}${label ? ` (${label})` : ""}${qty > 1 ? ` × ${qty}` : ""}`);
    },
    [productById, toast, findDesign, findVariant]
  );

  const setQty = useCallback((idx, delta) => {
    setCart((prev) => {
      const next = [...prev];
      if (!next[idx]) return prev;
      const qty = next[idx].qty + delta;
      if (qty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx] = { ...next[idx], qty };
      }
      return next;
    });
  }, []);

  const removeAt = useCallback(
    (idx) => {
      setCart((prev) => prev.filter((_, i) => i !== idx));
      toast("Removed from cart");
    },
    [toast]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () => cart.reduce((s, i) => s + unitPrice(i.id, i.variant) * i.qty, 0),
    [cart, unitPrice]
  );
  const shipping = useMemo(() => {
    if (!cartSubtotal) return 0;
    return cartSubtotal >= (config.freeShipAbove || 1499) ? 0 : config.shipFlat || 0;
  }, [cartSubtotal, config]);

  const openCart = useCallback(() => setDrawerOpen(true), []);
  const closeCart = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo(
    () => ({
      cart,
      drawerOpen,
      openCart,
      closeCart,
      addToCart,
      setQty,
      removeAt,
      clearCart,
      cartCount,
      cartSubtotal,
      shipping,
      unitPrice,
      lineLabel,
      lineImage
    }),
    [cart, drawerOpen, openCart, closeCart, addToCart, setQty, removeAt, clearCart, cartCount, cartSubtotal, shipping, unitPrice, lineLabel, lineImage]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
