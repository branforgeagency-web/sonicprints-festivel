import { Router } from "express";
import {
  createEnquiry,
  adminListEnquiries,
  adminUpdateEnquiryStatus
} from "../controllers/enquiryController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createEnquiry);
router.get("/admin", requireAdmin, adminListEnquiries);
router.patch("/admin/:id/status", requireAdmin, adminUpdateEnquiryStatus);

export default router;
