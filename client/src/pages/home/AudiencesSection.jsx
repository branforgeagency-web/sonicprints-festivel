import FinancialHeroAccordion from "../../components/FinancialHeroAccordion.jsx";
import { imgUrl } from "../../context/SiteContext.jsx";

const SONIC_6_PANELS = [
  {
    id: "corporate",
    title: "Corporates & Offices",
    subtitle: "Employee gifting that goes home and gets remembered",
    description: "Branded outer sleeves, a QR video greeting from your MD, employee name personalisation and named delivery slots. The idol and devotional items stay respectfully unbranded.",
    img: imgUrl("ganesha_office"),
    overlayClass: "fa-overlay-personal"
  },
  {
    id: "schools",
    title: "Schools",
    subtitle: "A festival the classroom can actually do",
    description: "Bal Ganesh and Make-Your-Own kits with your school name printed on the labels and the certificate. Workshop-ready packs with a teacher's run sheet.",
    img: imgUrl("ganesha_school"),
    overlayClass: "fa-overlay-business"
  },
  {
    id: "colleges",
    title: "Colleges & Academies",
    subtitle: "Staff gifting, hostel kits and campus celebrations",
    description: "The ₹299 Mini is built for hostel and PG rooms where a full puja setup isn't possible. Pair it with Employee boxes for faculty and a mandap for the campus hall.",
    img: imgUrl("ganesha_college"),
    overlayClass: "fa-overlay-freelance"
  },
  {
    id: "stationery",
    title: "Stationery & Gift Shops",
    subtitle: "Shelf-ready SKUs with a display that sells for you",
    description: "MRP-printed retail boxes, barcode-ready, plus a branded Sonic Prints display stand that turns two square feet of your shop into a festival counter.",
    img: imgUrl("ganesha_giftshop"),
    overlayClass: "fa-overlay-personal"
  },
  {
    id: "dealers",
    title: "Dealers & Distributors",
    subtitle: "A festival business you can run for ten days",
    description: "City, Zone and State partner tiers with trade pricing, a branded kiosk kit, marketing creatives and a buyback on sealed unsold non-food stock. You bring the location and the effort.",
    img: imgUrl("ganesha_dealer"),
    overlayClass: "fa-overlay-business"
  },
  {
    id: "households",
    title: "Households & Communities",
    subtitle: "Everything ready. Just welcome Bappa.",
    description: "One box for a simple home puja, a ten-minute mandap for the living room, and a rotating chakra backdrop that makes the whole setup unforgettable.",
    img: imgUrl("ganesha_home"),
    overlayClass: "fa-overlay-freelance"
  }
];

export default function AudiencesSection() {
  return (
    <div id="audiences">
      <FinancialHeroAccordion
        brandName="SONIC PRINTS"
        eyebrowText="BUILT FOR SIX KINDS OF BUYERS"
        headlineLine1="Tell us who you are. We build the "
        underlineWord="festival"
        headlineLine2=" around you."
        description="Every segment gets its own kit mix, branding options, custom pricing slabs, and dedicated delivery plan."
        ctaText="Request Rate Card"
        ctaHref="/bulk"
        panels={SONIC_6_PANELS}
        showNav={false}
      />
    </div>
  );
}
