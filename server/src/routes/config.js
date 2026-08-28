import { Router } from "express";
import { getPublicConfig, adminUpdateConfig } from "../controllers/configController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getPublicConfig);
router.put("/admin", requireAdmin, adminUpdateConfig);

export default router;
