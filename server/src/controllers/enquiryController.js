import Enquiry from "../models/Enquiry.js";

export async function createEnquiry(req, res, next) {
  try {
    const { segment, name, phone } = req.body;
    if (!segment || !name || !phone) {
      const err = new Error("Segment, name and mobile number are required");
      err.status = 400;
      throw err;
    }
    const enquiry = await Enquiry.create({
      segment: req.body.segment,
      organisation: req.body.organisation || "",
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email || "",
      city: req.body.city || "",
      kitsInterested: req.body.kitsInterested || [],
      approxQty: req.body.approxQty || "",
      neededBy: req.body.neededBy || "",
      brandingRequired: req.body.brandingRequired || "",
      note: req.body.note || ""
    });

    const whatsappText = buildWhatsAppEnquiryText(enquiry);
    res.status(201).json({ enquiry, whatsappText });
  } catch (err) {
    next(err);
  }
}

function buildWhatsAppEnquiryText(e) {
  const L = [];
  L.push("*SONIC PRINTS — BULK ENQUIRY*");
  L.push("Ganesh Festival Collection 2026");
  L.push("");
  L.push(`Segment: ${e.segment}`);
  if (e.organisation) L.push(`Organisation: ${e.organisation}`);
  L.push(`Contact: ${e.name}`);
  L.push(`Mobile: ${e.phone}`);
  if (e.email) L.push(`Email: ${e.email}`);
  if (e.city) L.push(`City: ${e.city}`);
  if (e.kitsInterested?.length) L.push(`Kits of interest: ${e.kitsInterested.join(", ")}`);
  if (e.approxQty) L.push(`Approx. quantity: ${e.approxQty}`);
  if (e.neededBy) L.push(`Needed by: ${e.neededBy}`);
  if (e.brandingRequired) L.push(`Branding required: ${e.brandingRequired}`);
  if (e.note) {
    L.push("");
    L.push(`Note: ${e.note}`);
  }
  L.push("");
  L.push("Please send a rate card and confirm the delivery window.");
  return L.join("\n");
}

/* ---------------- admin ---------------- */

export async function adminListEnquiries(req, res, next) {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
    res.json(enquiries);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateEnquiryStatus(req, res, next) {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (err) {
    next(err);
  }
}
