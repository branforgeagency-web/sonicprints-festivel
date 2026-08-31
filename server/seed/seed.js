import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import Product from "../src/models/Product.js";
import Admin from "../src/models/Admin.js";
import SiteConfig from "../src/models/SiteConfig.js";
import productsData from "./productsData.js";

async function run() {
  await connectDB();

  console.log("[seed] Upserting products…");
  for (const p of productsData) {
    await Product.findOneAndUpdate({ id: p.id }, p, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log(`[seed] ${productsData.length} products ready.`);

  console.log("[seed] Ensuring site config…");
  await SiteConfig.findByIdAndUpdate(
    "site-config",
    {
      whatsapp: process.env.SITE_WHATSAPP || "+91 93845 56755",
      phone: process.env.SITE_PHONE || "+91 93845 56755",
      phoneHref: process.env.SITE_PHONE_HREF || "+91 93845 56755",
      email: process.env.SITE_EMAIL || "branforgeagency@gmail.com",
      city: process.env.SITE_CITY || "Coimbatore, Tamil Nadu",
      address: process.env.SITE_ADDRESS || "Sonic Prints, Coimbatore, Tamil Nadu, India",
      instagram: process.env.SITE_INSTAGRAM || "https://instagram.com/sonicprints",
      currency: process.env.SITE_CURRENCY || "INR",
      freeShipAbove: Number(process.env.SITE_FREE_SHIP_ABOVE || 1499),
      shipFlat: Number(process.env.SITE_SHIP_FLAT || 79),
      bulkThreshold: Number(process.env.SITE_BULK_THRESHOLD || 25),
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || ""
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("[seed] Site config ready.");

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@sonicprints.in").toLowerCase().trim();
  const existing = await Admin.findOne({ email: adminEmail });
  if (!existing) {
    const passwordHash = await Admin.hashPassword(process.env.ADMIN_PASSWORD || "change-this-password");
    await Admin.create({ email: adminEmail, passwordHash, name: "Sonic Prints Admin" });
    console.log(`[seed] Created admin user "${adminEmail}" — sign in at /admin/login with the password from .env`);
  } else {
    console.log(`[seed] Admin user "${adminEmail}" already exists — leaving it untouched.`);
  }

  await mongoose.disconnect();
  console.log("[seed] Done.");
}

run().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});
