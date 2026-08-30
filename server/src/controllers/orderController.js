import Order from "../models/Order.js";
import Product from "../models/Product.js";
import SiteConfig from "../models/SiteConfig.js";
import productsData from "../../seed/productsData.js";
import { getRazorpayInstance } from "../utils/razorpay.js";
import { createCashfreeOrderSession, fetchCashfreeOrderStatus } from "../utils/cashfree.js";
import crypto from "crypto";

async function getConfig() {
  let cfg = await SiteConfig.findById("site-config").lean();
  if (!cfg) cfg = (await SiteConfig.create({})).toObject();
  return cfg;
}

function findVariant(product, variantId) {
  if (!product.variants?.length) return null;
  return product.variants.find((v) => v.id === variantId) || product.variants[0];
}
function findDesign(product, designId) {
  if (!product.designs?.length) return null;
  return product.designs.find((d) => d.id === designId) || product.designs[0];
}

// Recomputes pricing from the database — the client sends only product ids,
// chosen variant/design and quantity. Nothing about price is trusted from the client.
async function priceCart(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    const err = new Error("Cart is empty");
    err.status = 400;
    throw err;
  }
  const ids = [...new Set(rawItems.map((i) => i.productId))];
  const products = await Product.find({ id: { $in: ids }, active: true }).lean();
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  const items = rawItems.map((raw) => {
    let product = byId[raw.productId];
    if (!product) {
      product = productsData.find((p) => p.id === raw.productId);
    }
    if (!product) {
      const err = new Error(`Product "${raw.productId}" is not available`);
      err.status = 400;
      throw err;
    }
    const qty = Math.max(1, parseInt(raw.qty, 10) || 1);
    const variant = findVariant(product, raw.variant);
    const design = findDesign(product, raw.design);
    const unitPrice = variant ? variant.price : product.price;
    return {
      productId: product.id,
      name: product.name,
      variant: variant?.id || null,
      variantName: variant?.name || "",
      design: design?.id || null,
      designName: design?.name || "",
      qty,
      unitPrice,
      lineTotal: unitPrice * qty
    };
  });

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  return { items, subtotal };
}

export async function quoteCart(req, res, next) {
  try {
    const { items: rawItems } = req.body;
    const { items, subtotal } = await priceCart(rawItems);
    const cfg = await getConfig();
    const shipping = subtotal === 0 ? 0 : subtotal >= cfg.freeShipAbove ? 0 : cfg.shipFlat;
    res.json({ items, subtotal, shipping, total: subtotal + shipping });
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req, res, next) {
  try {
    const { items: rawItems, customer, note, paymentMethod } = req.body;
    if (!customer?.name || !customer?.phone) {
      const err = new Error("Name and mobile number are required");
      err.status = 400;
      throw err;
    }

    const { items, subtotal } = await priceCart(rawItems);
    const cfg = await getConfig();
    const shipping = subtotal === 0 ? 0 : subtotal >= cfg.freeShipAbove ? 0 : cfg.shipFlat;
    const total = subtotal + shipping;

    const order = await Order.create({
      items,
      customer: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        city: customer.city || "",
        address: customer.address || "",
        buyerType: customer.buyerType || "An individual / household"
      },
      note: note || "",
      subtotal,
      shipping,
      total,
      paymentMethod: paymentMethod === "online" ? "online" : "whatsapp",
      paymentStatus: "pending"
    });

    const whatsappText = buildWhatsAppOrderText(order, cfg);
    res.status(201).json({ order, whatsappText, whatsappNumber: cfg.whatsapp });
  } catch (err) {
    next(err);
  }
}

function money(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function buildWhatsAppOrderText(order, cfg) {
  const L = [];
  L.push("*SONIC PRINTS — ORDER REQUEST*");
  L.push("Ganesh Festival Collection 2026");
  L.push("");
  L.push(`Order ref: ${order._id}`);
  L.push(`Name: ${order.customer.name}`);
  L.push(`Mobile: ${order.customer.phone}`);
  if (order.customer.email) L.push(`Email: ${order.customer.email}`);
  if (order.customer.city) L.push(`City / Pincode: ${order.customer.city}`);
  if (order.customer.address) L.push(`Address: ${order.customer.address}`);
  L.push(`Buyer type: ${order.customer.buyerType}`);
  L.push("");
  L.push("*Items*");
  order.items.forEach((it) => {
    const bits = [it.variantName, it.designName].filter(Boolean).join(" · ");
    L.push(`• ${it.name}${bits ? ` (${bits})` : ""} × ${it.qty} = ${money(it.lineTotal)}`);
  });
  L.push("");
  L.push(`Subtotal: ${money(order.subtotal)}`);
  L.push(`Delivery: ${order.shipping ? money(order.shipping) : "Free"}`);
  L.push(`*Total: ${money(order.total)}*`);
  if (order.note) {
    L.push("");
    L.push(`Note: ${order.note}`);
  }
  L.push("");
  L.push("Please confirm availability and delivery date.");
  return L.join("\n");
}

/* ---------------- Cashfree Payments ---------------- */

export async function createCashfreeOrder(req, res, next) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const sessionData = await createCashfreeOrderSession({
      orderId: order._id,
      amount: order.total,
      customerName: order.customer.name,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email
    });

    order.cashfreeOrderId = sessionData.cashfreeOrderId;
    order.cashfreeSessionId = sessionData.paymentSessionId;
    await order.save();

    res.json({
      paymentSessionId: sessionData.paymentSessionId,
      cashfreeOrderId: sessionData.cashfreeOrderId,
      orderId: order._id,
      envMode: sessionData.envMode
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyCashfreePayment(req, res, next) {
  try {
    const { orderId, cashfreeOrderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const targetCashfreeId = cashfreeOrderId || order.cashfreeOrderId;
    if (!targetCashfreeId) {
      return res.status(400).json({ message: "No Cashfree Order ID associated with this order" });
    }

    const cfOrder = await fetchCashfreeOrderStatus(targetCashfreeId);

    if (cfOrder && cfOrder.order_status === "PAID") {
      order.paymentStatus = "paid";
      order.status = "confirmed";
      if (cfOrder.order_payments && cfOrder.order_payments.length > 0) {
        order.cashfreePaymentId = cfOrder.order_payments[0].payment_id || String(targetCashfreeId);
      }
      await order.save();
      return res.json({ message: "Payment verified successfully", paid: true, order });
    } else {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: `Payment verification failed. Status: ${cfOrder?.order_status || "UNKNOWN"}`, paid: false });
    }
  } catch (err) {
    next(err);
  }
}

/* ---------------- Razorpay (optional online payment) ---------------- */

export async function createRazorpayOrder(req, res, next) {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(400).json({ message: "Online payment is not configured on this server yet" });
    }

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: "INR",
      receipt: String(order._id)
    });

    order.razorpayOrderId = rpOrder.id;
    await order.save();

    res.json({ razorpayOrderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency });
  } catch (err) {
    next(err);
  }
}

export async function verifyRazorpayPayment(req, res, next) {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    order.paymentStatus = "paid";
    order.razorpayPaymentId = razorpay_payment_id;
    order.status = "confirmed";
    await order.save();
    res.json({ message: "Payment verified", order });
  } catch (err) {
    next(err);
  }
}

// Called when a shopper picked "Pay online now" but closed the Razorpay
// modal before completing payment. Deliberately narrow: it only ever moves
// *this order* from new+pending+online to cancelled, so it can't be used to
// touch an order that has already been paid, confirmed, or placed via
// WhatsApp — it just stops silently-abandoned payment attempts from sitting
// in the admin queue looking like real pending orders.
export async function cancelAbandonedPayment(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentMethod === "online" && order.paymentStatus === "pending" && order.status === "new") {
      order.status = "cancelled";
      await order.save();
    }
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

/* ---------------- admin ---------------- */

export async function adminListOrders(req, res, next) {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
}
