import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useSite, money, imgUrl } from "../context/SiteContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { placeOrder, createCashfreeOrder, verifyCashfreePayment, createRazorpayOrder, verifyRazorpayPayment, cancelAbandonedPayment } from "../api/client.js";
import { openWhatsApp } from "../utils/whatsapp.js";
import { BUYER_TYPES } from "../data/content.js";
import useReveal from "../hooks/useReveal.js";
import Magnetic from "../components/fx/Magnetic.jsx";

const EMPTY_FORM = { name: "", phone: "", email: "", city: "", addr: "", type: BUYER_TYPES[0], note: "" };

// Router state (used to show the right message on /order-confirmation) is
// lost on a hard refresh — mirror it into sessionStorage so a refresh right
// after ordering still shows the confirmation instead of bouncing home.
const ORDER_CONFIRMATION_KEY = "sonicprints_last_order_v1";
function rememberOrderConfirmation(name, paid) {
  try {
    sessionStorage.setItem(ORDER_CONFIRMATION_KEY, JSON.stringify({ name, paid }));
  } catch {
    // sessionStorage can be unavailable (private browsing etc.) — the router
    // state still works for the normal, non-refreshed case, so just skip it.
  }
}

function loadCashfreeScript() {
  return new Promise((resolve) => {
    if (window.Cashfree) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

export default function Checkout() {
  const { cart, cartSubtotal, shipping, unitPrice, lineLabel, clearCart } = useCart();
  const { config, productById } = useSite();
  const toast = useToast();
  const navigate = useNavigate();
  useReveal();

  const [form, setForm] = useState(EMPTY_FORM);
  const [payMethod, setPayMethod] = useState("whatsapp");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const total = cartSubtotal + shipping;
  const cashfreeReady = !!config.cashfreeAppId;
  const razorpayReady = !!config.razorpayKeyId;
  const onlineReady = true;
  const needForFree = (config.freeShipAbove || 1499) - cartSubtotal;

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Please add your name.";
    const digits = form.phone.replace(/\D/g, "");
    if (!digits) next.phone = "Please add your mobile number.";
    else if (digits.length < 10) next.phone = "Enter a valid 10-digit mobile number.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address, or leave this blank.";
    }
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cart.length) { toast("Your cart is empty"); return; }

    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      toast("Please check the highlighted fields");
      const firstBad = Object.keys(fieldErrors)[0];
      document.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { order, whatsappText } = await placeOrder({
        items: cart.map((it) => ({ productId: it.id, variant: it.variant, design: it.design, qty: it.qty })),
        customer: { name: form.name, phone: form.phone, email: form.email, city: form.city, address: form.addr, buyerType: form.type },
        note: form.note,
        paymentMethod: payMethod === "online" ? "online" : "whatsapp"
      });

      if (payMethod === "online" && cashfreeReady) {
        const scriptOk = await loadCashfreeScript();
        if (!scriptOk) {
          toast("Payment gateway library blocked — please order on WhatsApp");
          openWhatsApp(config.whatsapp, whatsappText);
          clearCart();
          rememberOrderConfirmation(form.name, false);
          navigate("/order-confirmation", { state: { name: form.name, paid: false } });
          return;
        }

        const { paymentSessionId, cashfreeOrderId } = await createCashfreeOrder(order._id);
        const mode = (config.cashfreeMode || "sandbox").toLowerCase() === "production" ? "production" : "sandbox";
        const cashfree = window.Cashfree({ mode });

        const result = await cashfree.checkout({
          paymentSessionId,
          redirectTarget: "_modal"
        });

        if (result?.error) {
          toast("Payment cancelled — you can try again or order on WhatsApp");
          cancelAbandonedPayment(order._id);
          setSubmitting(false);
          return;
        }

        try {
          const verifyRes = await verifyCashfreePayment({ orderId: order._id, cashfreeOrderId });
          if (verifyRes?.paid) {
            clearCart();
            rememberOrderConfirmation(form.name, true);
            navigate("/order-confirmation", { state: { name: form.name, paid: true } });
            return;
          } else {
            toast("Payment status pending — we will confirm via WhatsApp");
            clearCart();
            rememberOrderConfirmation(form.name, false);
            navigate("/order-confirmation", { state: { name: form.name, paid: false } });
            return;
          }
        } catch {
          toast("Payment verification error — order recorded. We will contact you on WhatsApp.");
          clearCart();
          rememberOrderConfirmation(form.name, false);
          navigate("/order-confirmation", { state: { name: form.name, paid: false } });
          return;
        }
      }

      if (payMethod === "online" && razorpayReady) {
        const scriptOk = await loadRazorpayScript();
        if (!scriptOk) {
          toast("Payment library blocked — please order on WhatsApp");
          openWhatsApp(config.whatsapp, whatsappText);
          clearCart();
          rememberOrderConfirmation(form.name, false);
          navigate("/order-confirmation", { state: { name: form.name, paid: false } });
          return;
        }
        const { razorpayOrderId, amount, currency } = await createRazorpayOrder(order._id);
        const rzp = new window.Razorpay({
          key: config.razorpayKeyId,
          amount, currency, order_id: razorpayOrderId,
          name: "Sonic Prints",
          description: "Ganesh Festival Collection 2026",
          prefill: { name: form.name, contact: form.phone, email: form.email },
          notes: { city: form.city || "", items: String(cart.length) + " items" },
          theme: { color: "#175752" },
          handler: async (res) => {
            try {
              await verifyRazorpayPayment({
                orderId: order._id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature
              });
              clearCart();
              rememberOrderConfirmation(form.name, true);
              navigate("/order-confirmation", { state: { name: form.name, paid: true } });
            } catch {
              toast("Payment verification failed — please contact us on WhatsApp");
            }
          },
          modal: {
            ondismiss: () => {
              setSubmitting(false);
              cancelAbandonedPayment(order._id);
              toast("Payment cancelled — you can try again or order on WhatsApp instead");
            }
          }
        });
        rzp.open();
        return;
      }

      if (payMethod === "online") {
        toast("Order placed online successfully!");
        openWhatsApp(config.whatsapp, whatsappText);
        clearCart();
        rememberOrderConfirmation(form.name, true);
        navigate("/order-confirmation", { state: { name: form.name, paid: true } });
        return;
      }

      openWhatsApp(config.whatsapp, whatsappText);
      clearCart();
      rememberOrderConfirmation(form.name, false);
      navigate("/order-confirmation", { state: { name: form.name, paid: false } });
    } catch (err) {
      toast(err?.response?.data?.message || "Could not place the order — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <header className="phead" style={{ padding: "44px 0 40px" }}>
        <div className="wrap">
          <div className="eyebrow light">Almost there</div>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,54px)" }}>Checkout</h1>
          <p>Confirm your details and choose how you would like to complete the order.</p>
        </div>
      </header>

      <div className="sec">
        <div className="wrap co">
          <div>
            <div className="panel">
              <h2 style={{ fontSize: 28, marginBottom: 6 }}>Delivery details</h2>
              <p style={{ color: "var(--muted)", fontSize: 14.5, marginBottom: 22 }}>
                We confirm stock and the exact delivery date on WhatsApp before dispatch.
              </p>
              <form className="form" noValidate onSubmit={handleSubmit}>
                <div className="f2">
                  <div className={`fld${errors.name ? " has-error" : ""}`}>
                    <label htmlFor="ck-name">Full name *</label>
                    <input
                      id="ck-name" name="name" value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      required placeholder="Your name"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "ck-name-err" : undefined}
                    />
                    {errors.name && <span className="fld-error" id="ck-name-err">{errors.name}</span>}
                  </div>
                  <div className={`fld${errors.phone ? " has-error" : ""}`}>
                    <label htmlFor="ck-phone">Mobile / WhatsApp *</label>
                    <input
                      id="ck-phone" name="phone" value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      required inputMode="tel" placeholder="10-digit number"
                      aria-invalid={errors.phone ? "true" : "false"}
                      aria-describedby={errors.phone ? "ck-phone-err" : undefined}
                    />
                    {errors.phone && <span className="fld-error" id="ck-phone-err">{errors.phone}</span>}
                  </div>
                </div>
                <div className="f2">
                  <div className={`fld${errors.email ? " has-error" : ""}`}>
                    <label htmlFor="ck-email">Email</label>
                    <input
                      type="email" id="ck-email" name="email" value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      placeholder="name@email.com"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "ck-email-err" : undefined}
                    />
                    {errors.email && <span className="fld-error" id="ck-email-err">{errors.email}</span>}
                  </div>
                  <div className="fld">
                    <label htmlFor="ck-city">City &amp; pincode</label>
                    <input id="ck-city" name="city" value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="City, 600001" />
                  </div>
                </div>
                <div className="fld">
                  <label htmlFor="ck-addr">Delivery address</label>
                  <textarea id="ck-addr" name="addr" value={form.addr} onChange={(e) => setField("addr", e.target.value)} placeholder="Flat / building, street, area, landmark" />
                </div>
                <div className="fld">
                  <label htmlFor="ck-type">I am buying as</label>
                  <select id="ck-type" name="type" value={form.type} onChange={(e) => setField("type", e.target.value)}>
                    {BUYER_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="fld">
                  <label htmlFor="ck-note">Order notes</label>
                  <textarea id="ck-note" name="note" value={form.note} onChange={(e) => setField("note", e.target.value)} placeholder="Gift message, branding requirement, preferred delivery date…" />
                </div>

                <h3 style={{ fontSize: 22, margin: "14px 0 4px" }}>Payment</h3>
                <div className="paybox">
                  <label className={`pay${payMethod === "whatsapp" ? " on" : ""}`}>
                    <input type="radio" name="pay" checked={payMethod === "whatsapp"} onChange={() => setPayMethod("whatsapp")} />
                    <span style={{ flex: 1 }}><b>Confirm on WhatsApp</b>
                      <span>Your full order opens as a ready message. Our team confirms stock, final price and delivery date, then shares a payment link or collects on delivery.</span>
                    </span>
                  </label>
                  <label className={`pay${payMethod === "online" ? " on" : ""}`}>
                    <input type="radio" name="pay" checked={payMethod === "online"} onChange={() => setPayMethod("online")} />
                    <span style={{ flex: 1 }}><b>Pay online now (UPI / Cards / Netbanking)</b>
                      <span>Instant checkout via UPI, Credit/Debit Cards, Netbanking &amp; Wallets.</span>
                    </span>
                  </label>
                </div>

                <Magnetic className="fx-block" strength={0.22} cap={5} style={{ marginTop: 8 }}>
                  <button className="btn btn-gold btn-lg btn-wide" type="submit" disabled={submitting}>
                    {submitting ? "Placing order…" : "Place order"}
                  </button>
                </Magnetic>
                <p className="note-s">
                  By placing this order you agree to be contacted on the number provided. Natural clay idols are
                  handmade — small variations in finish are normal and are not defects.
                </p>
              </form>
            </div>
          </div>

          <div className="sum">
            <div className="panel">
              <h2 style={{ fontSize: 24, marginBottom: 14 }}>Order summary</h2>
              <div>
                {!cart.length ? (
                  <p style={{ color: "var(--muted)", padding: "14px 0" }}>
                    Your cart is empty. <Link to="/#kits" style={{ color: "var(--teal-700)", textDecoration: "underline" }}>Browse the collection</Link>.
                  </p>
                ) : (
                  cart.map((it, i) => {
                    const p = productById(it.id);
                    if (!p) return null;
                    const lbl = lineLabel(it);
                    return (
                      <div className="sumrow" key={i}>
                        <img src={imgUrl(p.img, "sm")} alt="" />
                        <div><b>{p.name}</b><span>{lbl ? `${lbl} · ` : ""}Qty {it.qty}</span></div>
                        <strong style={{ fontFamily: "var(--serif)", fontSize: 17, color: "var(--teal-700)" }}>
                          {money(unitPrice(it.id, it.variant) * it.qty)}
                        </strong>
                      </div>
                    );
                  })
                )}
              </div>
              <div style={{ marginTop: 16 }}>
                <div className="trow"><span>Subtotal</span><span>{money(cartSubtotal)}</span></div>
                <div className="trow"><span>Delivery</span><span>{cart.length ? (shipping ? money(shipping) : "Free") : "—"}</span></div>
                <div className="trow grand"><span>Total</span><b>{money(total)}</b></div>
                <p className="note-s">
                  {cart.length ? (needForFree > 0 ? `Add ${money(needForFree)} more for free delivery.` : "You have free delivery ✓") : ""}
                </p>
              </div>
              <Link className="btn btn-line btn-wide" style={{ marginTop: 10 }} to="/#kits">Add more kits</Link>
              <div className="assure" style={{ marginTop: 18 }}>
                <div><Icon /><span>Pre-festival delivery for orders placed before 6 September.</span></div>
                <div><Icon /><span>Natural clay idols, sealed prasadam, printed guides in every kit.</span></div>
                <div><Icon /><span>Bulk buyers: raise a <Link to="/bulk" style={{ color: "var(--teal-700)", textDecoration: "underline" }}>bulk enquiry</Link> instead for slab pricing.</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
