import SiteConfig from "../models/SiteConfig.js";

async function getOrCreate() {
  let cfg = await SiteConfig.findById("site-config");
  if (!cfg) cfg = await SiteConfig.create({});
  return cfg;
}

export async function getPublicConfig(req, res, next) {
  try {
    const cfg = await getOrCreate();
    const obj = cfg.toObject();
    // Never expose the Razorpay key id under a name that looks secret — it's public by design,
    // but we still keep it explicit and only send what the storefront needs.
    res.json({
      whatsapp: obj.whatsapp,
      phone: obj.phone,
      phoneHref: obj.phoneHref,
      email: obj.email,
      city: obj.city,
      address: obj.address,
      instagram: obj.instagram,
      currency: obj.currency,
      freeShipAbove: obj.freeShipAbove,
      shipFlat: obj.shipFlat,
      bulkThreshold: obj.bulkThreshold,
      cashfreeAppId: obj.cashfreeAppId || process.env.CASHFREE_APP_ID || "",
      cashfreeMode: obj.cashfreeMode || process.env.CASHFREE_MODE || "sandbox",
      razorpayKeyId: obj.razorpayKeyId || process.env.RAZORPAY_KEY_ID || "",
      festivalDateISO: obj.festivalDateISO,
      orderCutoffLabel: obj.orderCutoffLabel
    });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateConfig(req, res, next) {
  try {
    const cfg = await SiteConfig.findByIdAndUpdate("site-config", req.body, {
      new: true,
      upsert: true,
      runValidators: true
    });
    res.json(cfg);
  } catch (err) {
    next(err);
  }
}
