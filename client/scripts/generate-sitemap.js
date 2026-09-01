import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.VITE_SITE_URL || "https://sonicprints.shop";

const STATIC_PAGES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/bulk", priority: "0.9", changefreq: "weekly" },
  { path: "/track", priority: "0.8", changefreq: "daily" },
  { path: "/checkout", priority: "0.7", changefreq: "monthly" },
  { path: "/sitemap", priority: "0.6", changefreq: "weekly" },
];

const PRODUCTS = [
  { slug: "shubharambh-mini", title: "Shubharambh Mini Eco-Friendly Clay Ganesh Puja Kit", img: "/assets/img/mini.jpg", priority: "0.9", changefreq: "weekly" },
  { slug: "employee-puja-box", title: "Employee Puja Box Shubharambh Corporate Ganesh Kit", img: "/assets/img/employee.jpg", priority: "0.9", changefreq: "weekly" },
  { slug: "bal-ganesh-kids-kit", title: "Bal Ganesh Kids Kit Devotional Story & Craft Box", img: "/assets/img/kids.jpg", priority: "0.9", changefreq: "weekly" },
  { slug: "make-your-own-ganesha", title: "Make Your Own Ganesha DIY Clay Idol Modelling Kit", img: "/assets/img/diy.jpg", priority: "0.9", changefreq: "weekly" },
  { slug: "gruha-ganapathi-mandap", title: "Gruha Ganapathi Instant 10-Minute Mandap Temple Arch", img: "/assets/img/mandap.jpg", priority: "0.9", changefreq: "weekly" },
  { slug: "rotating-chakra-backdrop", title: "Rotating Chakra Motorized LED Mandap Backdrop", img: "/assets/img/chakra.jpg", priority: "0.9", changefreq: "weekly" },
];

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function generateSitemapXml() {
  const currentDate = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Static pages
  STATIC_PAGES.forEach((page) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(BASE_URL + page.path)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(currentDate)}</lastmod>\n`;
    xml += `    <changefreq>${escapeXml(page.changefreq)}</changefreq>\n`;
    xml += `    <priority>${escapeXml(page.priority)}</priority>\n`;
    if (page.path === "/") {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(BASE_URL + "/assets/img/hero-banner.jpg")}</image:loc>\n`;
      xml += `      <image:title>${escapeXml("Sonic Prints Eco-Friendly Ganesh Festival Collection 2026")}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  // Product pages
  PRODUCTS.forEach((prod) => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(BASE_URL + "/kit/" + prod.slug)}</loc>\n`;
    xml += `    <lastmod>${escapeXml(currentDate)}</lastmod>\n`;
    xml += `    <changefreq>${escapeXml(prod.changefreq)}</changefreq>\n`;
    xml += `    <priority>${escapeXml(prod.priority)}</priority>\n`;
    xml += `    <image:image>\n`;
    xml += `      <image:loc>${escapeXml(BASE_URL + prod.img)}</image:loc>\n`;
    xml += `      <image:title>${escapeXml(prod.title)}</image:title>\n`;
    xml += `    </image:image>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

// If executed directly via node CLI
if (process.argv[1] === __filename || process.argv[1].endsWith("generate-sitemap.js")) {
  const publicDir = path.resolve(__dirname, "../public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapXml = generateSitemapXml();
  const outputPath = path.join(publicDir, "sitemap.xml");

  fs.writeFileSync(outputPath, sitemapXml, "utf8");
  console.log(`[Sitemap] Generated XML Sitemap at: ${outputPath}`);
}
