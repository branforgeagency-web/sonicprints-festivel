// Static marketing copy for the storefront — everything that isn't a product,
// order or enquiry (those live in MongoDB and come from the API). Edit this
// file and redeploy the client to change any of this text.

export const STRIP_ITEMS = [
  "Natural clay idols", "Sealed prasadam", "Custom printed branding", "Pan-India dispatch",
  "Bulk from 25 units", "Dealer & franchise programme", "Ready in 10 minutes", "Eco-safe home visarjan",
  "School & corporate packs"
];

export const AUDIENCES = [
  {
    icon: "office",
    title: "Corporates & Offices",
    line: "Employee gifting that goes home and gets remembered",
    text: "Branded outer sleeves, a QR video greeting from your MD, employee name personalisation and named delivery slots. The idol and devotional items stay respectfully unbranded.",
    bullets: [
      "Custom sleeve & greeting card from 25 boxes",
      "QR video blessing per employee",
      "Named-slot delivery before the festival",
      "GST invoice, e-way bill, single PO"
    ]
  },
  {
    icon: "school",
    title: "Schools",
    line: "A festival the classroom can actually do",
    text: "Bal Ganesh and Make-Your-Own kits with your school name printed on the labels and the certificate. Workshop-ready packs with a teacher's run sheet.",
    bullets: [
      "School name & logo on labels and certificates",
      "Workshop run sheet for teachers",
      "Age-graded 5–12 and 6–14 packs",
      "Bulk packs from 50 units"
    ]
  },
  {
    icon: "college",
    title: "Colleges & Academies",
    line: "Staff gifting, hostel kits and campus celebrations",
    text: "The ₹299 Mini is built for hostel and PG rooms where a full puja setup isn't possible. Pair it with Employee boxes for faculty and a mandap for the campus hall.",
    bullets: [
      "Hostel & PG friendly compact kits",
      "Faculty and trustee gifting tiers",
      "Campus mandap and chakra backdrop",
      "Student ambassador programme available"
    ]
  },
  {
    icon: "shop",
    title: "Stationery & Gift Shops",
    line: "Shelf-ready SKUs with a display that sells for you",
    text: "MRP-printed retail boxes, barcode-ready, plus a branded Sonic Prints display stand that turns two square feet of your shop into a festival counter.",
    bullets: [
      "MRP printed, retail-ready packaging",
      "Free branded display stand at qualifying volume",
      "Fast-moving ₹299 / ₹349 price points",
      "Replenishment within 48 hours in serviced cities"
    ]
  },
  {
    icon: "dealer",
    title: "Dealers & Distributors",
    line: "A festival business you can run for ten days",
    text: "City, Zone and State partner tiers with trade pricing, a branded kiosk kit, marketing creatives and a buyback on sealed unsold non-food stock. You bring the location and the effort.",
    bullets: [
      "City / Zone / State partner tiers",
      "Branded 3×3 m kiosk kit with display units",
      "Reels, creatives and WhatsApp catalogue provided",
      "Buyback on sealed unsold non-food stock"
    ]
  },
  {
    icon: "home",
    title: "Households & Communities",
    line: "Everything ready. Just welcome Bappa.",
    text: "One box for a simple home puja, a ten-minute mandap for the living room, and a rotating chakra backdrop that makes the whole setup unforgettable.",
    bullets: [
      "Doorstep delivery before the festival",
      "Apartment association group orders",
      "Ten-minute mandap, no tools or carpenter",
      "Natural clay idols, safe for home visarjan"
    ]
  }
];

export const KIDS_JOURNEY = [
  {
    title: "Meet Bappa",
    text: "Walk through the festive street and discover Bal Ganesh & his story book.",
    img: "kids-step-1",
    badge: "✨ 1. Discover Bappa & Festival Story"
  },
  {
    title: "Unbox & Welcome",
    text: "Bring the festival activity kit home to a warm, decorated living room.",
    img: "kids-step-2",
    badge: "🎁 2. Welcome Bappa & Kit Home"
  },
  {
    title: "Colour & Craft",
    text: "Colour the story book, place stickers, mould clay and craft with friends.",
    img: "kids-step-3",
    badge: "🎨 3. Colour, Sticker & Craft Together"
  },
  {
    title: "Divine Blessing",
    text: "Experience the magic as Bal Ganesh fills your clay creation with divine light.",
    img: "kids-step-4",
    badge: "✨ 4. Divine Blessing & Clay Idol"
  },
  {
    title: "Pray & Celebrate",
    text: "Fold hands together, lead the family puja, and complete eco-visarjan.",
    img: "kids-step-5",
    badge: "🪔 5. Family Puja & Eco Visarjan"
  }
];

export const DEALER_CARDS = [
  {
    img: "display-main",
    title: "The Collection Stand",
    text: "All six kits on one branded unit — arch header, tiered shelves, price rails and a base plinth."
  },
  {
    img: "display-kids",
    title: "The Kids Counter",
    text: "Bal Ganesh and Make Your Own facing out — the fastest-moving unit in stationery and gift stores."
  },
  {
    img: "display-chakra",
    title: "The Live Demo Wall",
    text: "Six chakra backdrops turning under warm light. Nothing sells this product faster than seeing it move."
  }
];

export const HOW_STEPS = [
  { title: "Choose your kits", text: "Pick from six ready collections, or tell us your audience and budget and we will build the mix." },
  { title: "Approve a sample", text: "We send photographs — or a physical sample for bulk orders — before a single box is packed." },
  { title: "Share your branding", text: "Logo, greeting message, employee or school names. We print sleeves, cards and certificates." },
  { title: "We pack and deliver", text: "Packed, quality-checked and dispatched to reach you before Ganesh Chaturthi." }
];

export const FAQ_ITEMS = [
  {
    q: "When will my order be delivered?",
    a: "Orders placed before 6 September are delivered ahead of Ganesh Chaturthi on 14 September. Bulk and branded orders need artwork approval at least 7 working days before your delivery date. Our team confirms an exact delivery window on WhatsApp once your order is placed."
  },
  {
    q: "Are the idols eco-friendly?",
    a: "Yes. Every idol in the collection is natural unbaked clay with non-toxic, water-soluble colouring — no plaster of Paris and no thermocol. All kits carry home-visarjan instructions, and the Make Your Own Ganesha kit includes a guided eco visarjan step."
  },
  {
    q: "Can we print our company or school branding?",
    a: "Yes — that is what Sonic Prints does. Branding goes on the outer sleeve, the greeting card, the certificates and the printed inserts. We never print a logo on the idol or on any devotional item. Custom sleeves start at 25 units for the Employee Puja Box and 50 units for school packs."
  },
  {
    q: "Is the prasadam safe and how long does it keep?",
    a: "The prasadam in every kit is a sealed, labelled pack sourced from an FSSAI-licensed supplier, with the licence number and best-before date printed on the box. We never repack loose sweets. Fresh local prasadam is available as a city-level add-on for counter pickup only."
  },
  {
    q: "How does the rotating chakra backdrop work?",
    a: "A concealed high-torque motor turns the centre disc while the outer decorative ring stays still. It runs on a standard plug-and-play adapter, fits behind idols of almost any size on its rear support bracket, and assembles without tools in a few minutes."
  },
  {
    q: "What are your bulk and dealer prices?",
    a: "Every product page shows indicative slab pricing from 25 units upward. Dealer and distributor tiers, kiosk kits and buyback terms are shared after a short call — raise a bulk enquiry and our team will send a rate card the same working day."
  }
];

export const BULK_SEGMENTS = [
  {
    id: "corporate",
    name: "Corporates & Offices",
    icon: "office",
    line: "Employee gifting that goes home and gets remembered",
    text: "Branded outer sleeves, a QR video greeting from your MD, employee name personalisation and named delivery slots. The idol and devotional items stay respectfully unbranded.",
    recommended: "Employee Puja Box · Shubharambh Mini · Make Your Own Ganesha"
  },
  {
    id: "schools",
    name: "Schools",
    icon: "school",
    line: "A festival the classroom can actually do",
    text: "Bal Ganesh and Make-Your-Own kits with your school name printed on the labels and the certificate. Workshop-ready packs with a teacher's run sheet.",
    recommended: "Bal Ganesh · Make Your Own Ganesha · Shubharambh Mini"
  },
  {
    id: "colleges",
    name: "Colleges & Academies",
    icon: "college",
    line: "Staff gifting, hostel kits and campus celebrations",
    text: "The ₹299 Mini is built for hostel and PG rooms where a full puja setup isn't possible. Pair it with Employee boxes for faculty and a mandap for the campus hall.",
    recommended: "Shubharambh Mini · Employee Puja Box · Gruha Ganapathi"
  },
  {
    id: "stationery",
    name: "Stationery & Gift Shops",
    icon: "shop",
    line: "Shelf-ready SKUs with a display that sells for you",
    text: "MRP-printed retail boxes, barcode-ready, plus a branded Sonic Prints display stand that turns two square feet of your shop into a festival counter.",
    recommended: "Shubharambh Mini · Bal Ganesh · Make Your Own Ganesha"
  },
  {
    id: "dealers",
    name: "Dealers & Distributors",
    icon: "dealer",
    line: "A festival business you can run for ten days",
    text: "City, Zone and State partner tiers with trade pricing, a branded kiosk kit, marketing creatives and a buyback on sealed unsold non-food stock. You bring the location and the effort.",
    recommended: "Shubharambh Mini · Bal Ganesh · Motorized Rotating Chakra"
  },
  {
    id: "household",
    name: "Households & Communities",
    icon: "home",
    line: "Everything ready. Just welcome Bappa.",
    text: "One box for a simple home puja, a ten-minute mandap for the living room, and a rotating chakra backdrop that makes the whole setup unforgettable.",
    recommended: "Shubharambh Mini · Gruha Ganapathi · Motorized Rotating Chakra"
  }
];

export const BULK_KIT_OPTIONS = [
  "Shubharambh Mini", "Employee Puja Box", "Bal Ganesh", "Make Your Own Ganesha",
  "Gruha Ganapathi", "Motorized Rotating Chakra"
];

export const BULK_QTY_OPTIONS = ["25 – 99", "100 – 499", "500 – 1,999", "2,000 – 9,999", "10,000 +", "Not sure yet"];

export const BULK_BRANDING_OPTIONS = [
  "Custom printed sleeve with our logo",
  "Sleeve + greeting card + QR video message",
  "Sleeve + certificates / name labels",
  "No branding — plain retail packs",
  "Not decided yet"
];

export const VOLUME_RATE_TABLE = [
  { kit: "Shubharambh Mini", mrp: 299, t1: 269, t2: 239, t3: 209, t4: 185 },
  { kit: "Employee Puja Box", mrp: 499, t1: 449, t2: 419, t3: 399, t4: 379 },
  { kit: "Bal Ganesh", mrp: 349, t1: 319, t2: 289, t3: 259, t4: 239 },
  { kit: "Make Your Own Ganesha", mrp: 499, t1: 459, t2: 429, t3: 389, t4: 359 },
  { kit: "Gruha Ganapathi", mrp: 699, t1: 649, t2: 599, t3: 549, t4: 499 },
  { kit: "Motorized Rotating Chakra", mrp: 999, t1: 949, t2: 899, t3: 849, t4: 799 }
];

export const BUYER_TYPES = [
  "An individual / household", "A corporate or office", "A school", "A college or academy",
  "A stationery or gift shop", "A dealer or distributor", "An apartment association"
];
