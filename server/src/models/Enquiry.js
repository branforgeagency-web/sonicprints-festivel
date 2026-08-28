import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    segment: { type: String, required: true }, // e.g. "Corporates & Offices"
    organisation: { type: String, default: "" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    city: { type: String, default: "" },
    kitsInterested: { type: [String], default: [] },
    approxQty: { type: String, default: "" },
    neededBy: { type: String, default: "" },
    brandingRequired: { type: String, default: "" },
    note: { type: String, default: "" },

    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "won", "lost"],
      default: "new"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", EnquirySchema);
