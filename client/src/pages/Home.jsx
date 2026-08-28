import useReveal from "../hooks/useReveal.js";
import useHashScroll from "../hooks/useHashScroll.js";
import { useSite } from "../context/SiteContext.jsx";
import Hero from "./home/Hero.jsx";
import KitsSection from "./home/KitsSection.jsx";
import AudiencesSection from "./home/AudiencesSection.jsx";
import KidsSection from "./home/KidsSection.jsx";
import ChakraSection from "./home/ChakraSection.jsx";
import RetailSection from "./home/RetailSection.jsx";
import HowSection from "./home/HowSection.jsx";
import FaqSection from "./home/FaqSection.jsx";
import ContactCta from "./home/ContactCta.jsx";

export default function Home() {
  const { loading } = useSite();
  useReveal();
  useHashScroll(!loading);

  return (
    <div className="page" id="page-home">
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
