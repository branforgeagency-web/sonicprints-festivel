import { Router } from "express";
import {
  listProducts,
  getProductBySlug,
  adminListProducts,
  adminGetProduct,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", listProducts);
router.get("/admin", requireAdmin, adminListProducts);
router.get("/admin/:id", requireAdmin, adminGetProduct);
router.post("/admin", requireAdmin, adminCreateProduct);
router.put("/admin/:id", requireAdmin, adminUpdateProduct);
router.delete("/admin/:id", requireAdmin, adminDeleteProduct);
router.get("/:slug", getProductBySlug);

export default router;
