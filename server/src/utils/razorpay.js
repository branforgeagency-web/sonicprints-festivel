import Razorpay from "razorpay";

let instance = null;
let attempted = false;

// Returns a configured Razorpay client, or null when no keys are set —
// callers should treat "online payment" as disabled in that case and
// fall back to the WhatsApp checkout flow.
export function getRazorpayInstance() {
  if (attempted) return instance;
  attempted = true;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  instance = new Razorpay({ key_id, key_secret });
  return instance;
}
