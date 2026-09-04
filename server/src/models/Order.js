import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, // Product.id
    name: { type: String, required: true },
    variant: { type: String, default: null },
    variantName: { type: String, default: "" },
    design: { type: String, default: null },
    designName: { type: String, default: "" },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, sparse: true, index: true },
    items: { type: [OrderItemSchema], required: true, validate: (v) => v.length > 0 },

    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, default: "" },
      city: { type: String, default: "" },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null }
      },
      mapUrl: { type: String, default: "" },
      buyerType: { type: String, default: "An individual / household" }
    },
    note: { type: String, default: "" },

    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["whatsapp", "online"], default: "whatsapp" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    cashfreeOrderId: { type: String, default: "" },
    cashfreeSessionId: { type: String, default: "" },
    cashfreePaymentId: { type: String, default: "" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },

    status: {
      type: String,
      enum: ["new", "confirmed", "packed", "dispatched", "delivered", "cancelled"],
      default: "new"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
