import mongoose from "mongoose";

// Singleton document (there is always exactly one, with a fixed _id).
const SiteConfigSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "site-config" },
    whatsapp: { type: String, default: "+91 63827 18655" },
    phone: { type: String, default: "+91 63827 18655" },
    phoneHref: { type: String, default: "+91 63827 18655" },
    email: { type: String, default: "branforgeagency@gmail.com" },
    city: { type: String, default: "Coimbatore, Tamil Nadu" },
    address: { type: String, default: "Sonic Prints, Coimbatore, Tamil Nadu, India" },
    instagram: { type: String, default: "https://instagram.com/sonicprints" },
    currency: { type: String, default: "INR" },
    freeShipAbove: { type: Number, default: 1499 },
    shipFlat: { type: Number, default: 79 },
    bulkThreshold: { type: Number, default: 25 },
    cashfreeAppId: { type: String, default: "" },
    cashfreeSecretKey: { type: String, default: "" },
    cashfreeMode: { type: String, default: "sandbox" },
    razorpayKeyId: { type: String, default: "" },
    festivalDateISO: { type: String, default: "2026-09-14T06:00:00+05:30" },
    orderCutoffLabel: { type: String, default: "Order by 6 Sept for guaranteed pre-festival delivery" }
  },
  { timestamps: true }
);

export default mongoose.model("SiteConfig", SiteConfigSchema);
