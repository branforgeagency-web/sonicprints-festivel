import Product from "../models/Product.js";
import SiteConfig from "../models/SiteConfig.js";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";
import Counter from "../models/Counter.js";
import productsData from "../../seed/productsData.js";

export async function autoSeed() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("[autoSeed] Products collection is empty. Seeding initial catalog...");
      for (const p of productsData) {
        await Product.findOneAndUpdate({ id: p.id }, p, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        });
      }
      console.log(`[autoSeed] ${productsData.length} products seeded successfully.`);
    }

    const cfg = await SiteConfig.findById("site-config");
    if (!cfg) {
      console.log("[autoSeed] Creating initial site config...");
      await SiteConfig.create({
        _id: "site-config",
        whatsapp: process.env.SITE_WHATSAPP || "+91 93845 56755",
        phone: process.env.SITE_PHONE || "+91 93845 56755",
        phoneHref: process.env.SITE_PHONE_HREF || "+91 93845 56755",
        email: process.env.SITE_EMAIL || "branforgeagency@gmail.com",
        city: process.env.SITE_CITY || "Coimbatore, Tamil Nadu",
        address: process.env.SITE_ADDRESS || "Sonic Prints, Coimbatore, Tamil Nadu, India",
        instagram: process.env.SITE_INSTAGRAM || "https://www.instagram.com/sonicprints.in",
        currency: process.env.SITE_CURRENCY || "INR",
        freeShipAbove: Number(process.env.SITE_FREE_SHIP_ABOVE || 1499),
        shipFlat: Number(process.env.SITE_SHIP_FLAT || 79),
        bulkThreshold: Number(process.env.SITE_BULK_THRESHOLD || 25),
        cashfreeAppId: process.env.CASHFREE_APP_ID || "",
        cashfreeMode: process.env.CASHFREE_MODE || "sandbox",
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || ""
      });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@sonicprints.in").toLowerCase().trim();
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      const passwordHash = await Admin.hashPassword(process.env.ADMIN_PASSWORD || "change-this-password");
      await Admin.create({ email: adminEmail, passwordHash, name: "Sonic Prints Admin" });
      console.log(`[autoSeed] Created default admin user: ${adminEmail}`);
    }

    // Backfill orderId for existing orders if any are missing
    const unassignedOrders = await Order.find({
      $or: [{ orderId: { $exists: false } }, { orderId: null }, { orderId: "" }]
    }).sort({ createdAt: 1 });

    if (unassignedOrders.length > 0) {
      console.log(`[autoSeed] Found ${unassignedOrders.length} orders without orderId. Backfilling...`);
      let counterDoc = await Counter.findById("orderId");
      let currentSeq = counterDoc ? counterDoc.seq : 0;

      for (const ord of unassignedOrders) {
        currentSeq += 1;
        const formatted = `#SONIC${String(currentSeq).padStart(3, "0")}`;
        await Order.updateOne({ _id: ord._id }, { $set: { orderId: formatted } });
      }

      await Counter.findByIdAndUpdate(
        "orderId",
        { $set: { seq: currentSeq } },
        { upsert: true }
      );
      console.log(`[autoSeed] Backfilled ${unassignedOrders.length} orders. Next order will be #SONIC${String(currentSeq + 1).padStart(3, "0")}.`);
    } else {
      const existingOrderCount = await Order.countDocuments();
      const counterDoc = await Counter.findById("orderId");
      if (!counterDoc && existingOrderCount > 0) {
        await Counter.create({ _id: "orderId", seq: existingOrderCount });
      }
    }
  } catch (err) {
    console.error("[autoSeed] Automatic seeding error:", err.message);
  }
}
