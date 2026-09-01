import useReveal from "../hooks/useReveal.js";
import useHashScroll from "../hooks/useHashScroll.js";
import { useSite } from "../context/SiteContext.jsx";
import SEOHead from "../components/SEOHead.jsx";
import { FAQ_ITEMS } from "../data/content.js";
import Hero from "./home/Hero.jsx";
import KitsSection from "./home/KitsSection.jsx";
import AudiencesSection from "./home/AudiencesSection.jsx";
import KidsSection from "./home/KidsSection.jsx";
import ChakraSection from "./home/ChakraSection.jsx";
import RetailSection from "./home/RetailSection.jsx";
import HowSection from "./home/HowSection.jsx";
import FaqSection from "./home/FaqSection.jsx";
import ContactCta from "./home/ContactCta.jsx";

const BASE_URL = import.meta.env.VITE_SITE_URL || "https://sonicprints.shop";

export default function Home() {
  const { loading } = useSite();
  useReveal();
  useHashScroll(!loading);

  const homeSchema = {
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
        "description": "Premium 100% Eco-Friendly Ganesh Festival Kits, Clay Idols, Kids Activity Boxes & Motorized Rotating Chakra Mandap Backdrops for 2026.",
        "sameAs": [
          "https://www.instagram.com/sonicprints.in"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        "url": BASE_URL,
        "name": "Sonic Prints | Ganesh Festival Collection 2026",
        "description": "Buy eco-friendly clay Ganesh idols, complete puja kits, instant mandaps, and rotating chakra backdrops.",
        "publisher": {
          "@id": `${BASE_URL}/#organization`
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/#faq`,
        "mainEntity": FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="page" id="page-home">
      <SEOHead
        title="Eco-Friendly Ganesh Festival Kits & Mandaps 2026 | Sonic Prints"
        description="Shop 100% eco-friendly clay Ganesh idols, complete puja kits from ₹299, kids DIY activity boxes, 10-minute instant mandaps and rotating chakra backdrops. Pan-India delivery."
        keywords="Ganesh Chaturthi 2026, Eco friendly Ganesh idol, clay ganesha online, ganesh puja kit, instant ganesh mandap, rotating chakra backdrop, bal ganesh kids kit, buy ganesha online india"
        canonical="/"
        schema={homeSchema}
      />
      <Hero />
      <KitsSection />
      <AudiencesSection />
      <KidsSection />
      <ChakraSection />
      <RetailSection />
      <HowSection />
      <FaqSection />
      <ContactCta />
    </div>
  );
}
