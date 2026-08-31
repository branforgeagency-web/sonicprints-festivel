import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useSite, money } from "../context/SiteContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { openWhatsApp } from "../utils/whatsapp.js";

export default function CartDrawer() {
  const {
    cart, drawerOpen, closeCart, setQty, removeAt,
    cartSubtotal, shipping, unitPrice, lineLabel, lineImage
  } = useCart();
  const { config, productById } = useSite();
  const toast = useToast();
  const navigate = useNavigate();

  const total = cartSubtotal + shipping;
  const needForFree = (config.freeShipAbove || 1499) - cartSubtotal;

  function goCheckout() {
    if (!cart.length) { toast("Your cart is empty"); return; }
    closeCart();
    navigate("/checkout");
  }

  function orderOnWhatsApp() {
    if (!cart.length) { toast("Your cart is empty"); return; }
    const lines = ["*SONIC PRINTS — ORDER REQUEST*", "Ganesh Festival Collection 2026", ""];
    lines.push("*Items*");
    cart.forEach((it) => {
      const p = productById(it.id);
      if (!p) return;
      const lbl = lineLabel(it);
      const up = unitPrice(it.id, it.variant);
      lines.push(`• ${p.name}${lbl ? ` (${lbl})` : ""} × ${it.qty} = ${money(up * it.qty)}`);
    });
    lines.push("", `Subtotal: ${money(cartSubtotal)}`, `Delivery: ${shipping ? money(shipping) : "Free"}`, `*Total: ${money(total)}*`, "", "Please confirm availability and delivery date.");
    openWhatsApp(config.whatsapp, lines.join("\n"));
  }

  return (
    <>
      <div className={`scrim${drawerOpen ? " on" : ""}`} onClick={closeCart} />
      <aside className={`drawer${drawerOpen ? " on" : ""}`} aria-label="Shopping cart">
        <div className="dhead">
          <div><b>Your Cart</b><span>Ganesh Collection 2026</span></div>
          <button className="xbtn" onClick={closeCart} aria-label="Close">✕</button>
        </div>
        <div className="ditems">
          {!cart.length ? (
            <div className="empty">
              <div className="om">ॐ</div>
              <p style={{ marginTop: 14 }}>Your cart is empty.<br />Add a festival kit to begin.</p>
              <a className="btn btn-line btn-sm" href="/#kits" onClick={(e) => { e.preventDefault(); closeCart(); navigate("/#kits"); }}>
                Browse the collection
              </a>
            </div>
          ) : (
            cart.map((it, i) => {
              const p = productById(it.id);
              if (!p) return null;
              const lbl = lineLabel(it);
              const up = unitPrice(it.id, it.variant);
              return (
                <div className="crow" key={i}>
                  <img src={lineImage(it)} alt={p.name} loading="lazy" decoding="async" />
                  <div>
                    <b>{p.name}</b>
                    {lbl && <span className="v">{lbl}</span>}
                    <span className="v">{money(up)} each</span>
                    <div className="qty">
                      <button aria-label="Decrease" onClick={() => setQty(i, -1)}>−</button>
                      <span>{it.qty}</span>
                      <button aria-label="Increase" onClick={() => setQty(i, 1)}>+</button>
                    </div>
                  </div>
                  <div className="rt">
                    <b>{money(up * it.qty)}</b><br />
                    <button className="rm" onClick={() => removeAt(i)}>Remove</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="dfoot">
          <div className="trow"><span>Subtotal</span><span>{money(cartSubtotal)}</span></div>
          <div className="trow"><span>Delivery</span><span>{cart.length ? (shipping ? money(shipping) : "Free") : "—"}</span></div>
          <div className="trow grand"><span>Total</span><b>{money(total)}</b></div>
          <p className="note-s" style={{ margin: "0 0 12px" }}>
            {cart.length ? (needForFree > 0 ? `Add ${money(needForFree)} more for free delivery.` : "You have free delivery ✓") : ""}
          </p>
          <button className="btn btn-gold btn-wide btn-lg" onClick={goCheckout}>Proceed to checkout</button>
          <button className="btn btn-line btn-wide" style={{ marginTop: 9 }} onClick={orderOnWhatsApp}>
            Order on WhatsApp instead
          </button>
          <p className="note-s">Our team confirms stock, price and delivery date before dispatch.</p>
        </div>
      </aside>
    </>
  );
}
