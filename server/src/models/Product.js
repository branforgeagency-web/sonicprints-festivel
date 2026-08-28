import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const DesignSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    note: { type: String, default: "" },
    img: { type: String, required: true }, // image key, e.g. "chakra-lotus"
    sheet: { type: String, default: "" }
  },
  { _id: false }
);

const SpecRowSchema = new mongoose.Schema(
  { label: String, value: String },
  { _id: false }
);

const PriceTierSchema = new mongoose.Schema(
  { range: String, price: Number, savingsLabel: String },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true }, // short code used by cart/order line items e.g. "mini"
    slug: { type: String, required: true, unique: true, index: true }, // used in URLs /kit/:slug
    name: { type: String, required: true },
    subtitle: { type: String, default: "" }, // e.g. "Ganesh Puja Kit"
    tag: { type: String, default: "" }, // quoted tagline shown on PDP
    badge: { type: String, default: "" }, // e.g. "Best Seller"
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true }, // base / "from" price
    img: { type: String, required: true }, // base image key (matches /assets/img/<img>.jpg)
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    variants: { type: [VariantSchema], default: [] },
    designs: { type: [DesignSchema], default: [] },

    highlights: {
      type: [{ title: String, text: String }],
      default: []
    },

    ledeParagraphs: { type: [String], default: [] },
    bestFor: { type: String, default: "" },
    whyHeadline: { type: String, default: "" },

    contents: { type: [String], default: [] }, // "inside the box" numbered items
    specs: { type: [SpecRowSchema], default: [] },
    bulkPricing: { type: [PriceTierSchema], default: [] },

    // Optional "how it works" step grid (e.g. mandap's 4-step setup, DIY's 6-step journey)
    processSteps: {
      eyebrow: { type: String, default: "" },
      headline: { type: String, default: "" },
      steps: { type: [{ title: String, text: String }], default: [] }
    },

    // ids of other products to show in "Goes well with"; if empty, computed at query time
    crossSell: { type: [String], default: [] },

    kitWho: { type: String, default: "" }, // short audience line on the kit card
    kitDescription: { type: String, default: "" } // card blurb (can differ slightly from shortDescription)
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
