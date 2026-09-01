import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://sonicprints.shop";

/**
 * SEOHead - Updates document title, meta tags, canonical links, OpenGraph,
 * and injects Schema.org JSON-LD structured data on route changes.
 */
export default function SEOHead({
  title = "Sonic Prints | Eco-Friendly Ganesh Festival Kits & Mandaps 2026",
  description = "Buy 100% eco-friendly clay Ganesh idols, complete puja kits, kids DIY Ganesha activity boxes, instant 10-minute mandaps and motorized rotating chakra backdrops online. Fast pan-India delivery.",
  keywords = "Ganesh Chaturthi 2026, Eco friendly Ganesh idol, clay ganesha online, ganesh puja kit, instant ganesh mandap, rotating chakra backdrop, bal ganesh kids kit, corporate ganesh gifting, buy ganesha online india, return gifts ganesh festival",
  image = `${BASE_URL}/assets/img/hero-banner.jpg`,
  canonical = null,
  type = "website",
  schema = null
}) {
  const location = useLocation();
  const currentUrl = canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to create or update meta tag
    function setMeta(name, content, attribute = "name") {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attribute, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    }

    // Helper to create or update link tag
    function setLink(rel, href) {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    }

    // 2. Standard Meta Tags
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("author", "Sonic Prints");
    setMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("theme-color", "#0A2E2B");

    // 3. Canonical URL
    setLink("canonical", currentUrl);

    // 4. OpenGraph Meta Tags
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", currentUrl, "property");
    setMeta("og:type", type, "property");
    setMeta("og:image", image.startsWith("http") ? image : `${BASE_URL}${image}`, "property");
    setMeta("og:site_name", "Sonic Prints Festival Collection", "property");
    setMeta("og:locale", "en_IN", "property");

    // 5. Twitter Card Meta Tags
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image.startsWith("http") ? image : `${BASE_URL}${image}`);

    // 6. Inject Schema.org JSON-LD Structured Data
    const scriptId = "seo-jsonld-schema";
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }

    if (schema) {
      scriptEl.textContent = JSON.stringify(schema);
    } else {
      // Default WebSite + Organization Schema
      const defaultSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            "name": "Sonic Prints",
            "url": BASE_URL,
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/assets/img/hero-banner.jpg`
            },
            "sameAs": []
          },
          {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            "url": BASE_URL,
            "name": "Sonic Prints | Ganesh Festival Collection 2026",
            "description": description,
            "publisher": {
              "@id": `${BASE_URL}/#organization`
            },
            "inLanguage": "en-IN"
          }
        ]
      };
      scriptEl.textContent = JSON.stringify(defaultSchema);
    }
  }, [title, description, keywords, image, currentUrl, type, schema]);

  return null;
}
