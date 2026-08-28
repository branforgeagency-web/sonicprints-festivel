import Product from "../models/Product.js";

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find({ active: true }).sort({ order: 1 }).lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true }).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });

    let crossSell = [];
    if (product.crossSell?.length) {
      crossSell = await Product.find({ id: { $in: product.crossSell }, active: true }).lean();
    } else {
      crossSell = await Product.find({ id: { $ne: product.id }, active: true })
        .sort({ order: 1 })
        .limit(3)
        .lean();
    }
    res.json({ ...product, crossSellProducts: crossSell });
  } catch (err) {
    next(err);
  }
}

/* ---------------- admin ---------------- */

export async function adminListProducts(req, res, next) {
  try {
    const products = await Product.find({}).sort({ order: 1 }).lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function adminGetProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function adminCreateProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
}
