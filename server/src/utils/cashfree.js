import axios from "axios";
import SiteConfig from "../models/SiteConfig.js";

export async function getCashfreeCredentials() {
  const cfg = await SiteConfig.findById("site-config").lean();
  const appId = process.env.CASHFREE_APP_ID || cfg?.cashfreeAppId || "";
  const secretKey = process.env.CASHFREE_SECRET_KEY || "";
  const envMode = (process.env.CASHFREE_MODE || cfg?.cashfreeMode || "sandbox").toLowerCase();
  const isProduction = envMode === "production" || envMode === "prod";

  return {
    appId,
    secretKey,
    isProduction,
    envMode: isProduction ? "production" : "sandbox",
    baseUrl: isProduction
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg"
  };
}

export async function createCashfreeOrderSession({ orderId, amount, customerName, customerPhone, customerEmail }) {
  const creds = await getCashfreeCredentials();

  if (!creds.appId || !creds.secretKey) {
    throw new Error("Cashfree payments are not fully configured on the server");
  }

  // Format customer phone: extract digits, minimum 10 digits
  const cleanPhone = String(customerPhone || "").replace(/\D/g, "") || "9999999999";
  const customerId = `cust_${cleanPhone.slice(-10)}_${String(orderId).slice(-6)}`;
  const cleanEmail = customerEmail && customerEmail.includes("@") ? customerEmail : "customer@sonicprints.com";

  const payload = {
    order_id: String(orderId),
    order_amount: Math.round(Number(amount) * 100) / 100, // format to 2 decimals if needed
    order_currency: "INR",
    customer_details: {
      customer_id: customerId,
      customer_name: customerName || "Customer",
      customer_email: cleanEmail,
      customer_phone: cleanPhone.length >= 10 ? cleanPhone.slice(-10) : "9999999999"
    },
    order_meta: {
      notify_url: process.env.CASHFREE_NOTIFY_URL || undefined
    }
  };

  const response = await axios.post(`${creds.baseUrl}/orders`, payload, {
    headers: {
      "x-client-id": creds.appId,
      "x-client-secret": creds.secretKey,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json"
    }
  });

  return {
    paymentSessionId: response.data.payment_session_id,
    cashfreeOrderId: response.data.order_id,
    orderStatus: response.data.order_status,
    envMode: creds.envMode
  };
}

export async function fetchCashfreeOrderStatus(cashfreeOrderId) {
  const creds = await getCashfreeCredentials();

  if (!creds.appId || !creds.secretKey) {
    throw new Error("Cashfree payments are not fully configured on the server");
  }

  const response = await axios.get(`${creds.baseUrl}/orders/${cashfreeOrderId}`, {
    headers: {
      "x-client-id": creds.appId,
      "x-client-secret": creds.secretKey,
      "x-api-version": "2023-08-01"
    }
  });

  return response.data;
}
