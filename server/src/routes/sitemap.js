import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/bulk", priority: "0.9", changefreq: "weekly" },
  { path: "/checkout", priority: "0.7", changefreq: "monthly" },
];

const FALLBACK_SLUGS = [
  "shubharambh-mini",
  "employee-puja-box",
  "bal-ganesh-kids-kit",
  "make-your-own-ganesha",
  "gruha-ganapathi-mandap",
  "rotating-chakra-backdrop"
];

router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_ORIGIN?.split(",")[0] || "https://sonicprints.in";
    const currentDate = new Date().toISOString().split("T")[0];

    let productSlugs = FALLBACK_SLUGS;

    try {
      const dbProducts = await Product.find({ active: { $ne: false } }, "slug updatedAt").lean();
      if (dbProducts && dbProducts.length > 0) {
        productSlugs = dbProducts.map((p) => p.slug);
      }
    } catch {
      // Fallback to static product list if DB is offline
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    STATIC_PAGES.forEach((page) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    productSlugs.forEach((slug) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/kit/${slug}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>\n`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    console.error("Sitemap generation error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
