// Fallback static Ganesh Festival Collection 2026 catalog
// Ensures kits and images display seamlessly even when backend API is offline.

export const FALLBACK_PRODUCTS = [
  {
    id: "mini",
    slug: "shubharambh-mini",
    name: "Shubharambh Mini",
    subtitle: "Ganesh Puja Kit",
    badge: "Best Seller",
    tag: "Bring Bappa Home in a Box",
    whyHeadline: "Bring Bappa Home in a Box",
    shortDescription:
      "A complete Ganesh puja in one compact box — clay idol, garland, every puja essential, katha, prasadam and a scan-to-watch puja guide.",
    kitDescription:
      "A complete Ganesh puja in one compact box — clay idol, garland, every puja essential, katha, prasadam and a scan-to-watch puja guide.",
    kitWho: "Hostels · PGs · Bachelors · Small shops · Offices · Return gifts",
    bestFor: "Hostels · PGs · Bachelors · Small shops · Offices · Return gifts",
    price: 299,
    img: "mini",
    order: 0,
    highlights: [
      { title: "Natural Clay Idol", text: "2.5–3 inch, handmade, home-visarjan safe" },
      { title: "Complete Puja Set", text: "Every essential for a full, correct puja" },
      { title: "Katha & 21 Names", text: "Printed guidance and prayers in your hands" },
      { title: "Sealed Prasadam", text: "Blessings ready to share with loved ones" }
    ],
    ledeParagraphs: [
      "The kit we built for everyone who wants to do Ganesh puja properly and simply doesn't know where to start. New city, first job, a hostel room, a small shop counter — the devotion is there, the shopping list isn't.",
      "Open the box and everything is already in front of you, in the order you need it. Place Bappa, light the diya, read the katha, offer the prasadam. Ten minutes, no experience needed, nobody to call."
    ],
    contents: [
      "Natural clay Ganesha idol (2.5–3 inch)", "Mini garland", "Puja cloth", "Pasupu", "Kumkum",
      "Akshata", "Cotton wicks", "Mini agarbatti pack", "Mini clay diya", "Ganesh Puja Guide",
      "21 Names & Katha card", "Sealed prasadam pack", "QR puja guide card"
    ],
    specs: [
      { label: "Idol", value: "Natural unbaked clay, 2.5–3 inch" },
      { label: "Box size", value: "Approx. 130 × 130 × 70 mm" },
      { label: "Puja items", value: "11 components + printed guides" },
      { label: "Prasadam", value: "Sealed pack from an FSSAI-licensed supplier" },
      { label: "Setup time", value: "Under 10 minutes" },
      { label: "Personalisation", value: "Custom printed sleeve from 100 units" }
    ],
    bulkPricing: [
      { range: "25 – 99 units", price: 269, savingsLabel: "₹30 off" },
      { range: "100 – 499 units", price: 239, savingsLabel: "₹60 off" },
      { range: "500 – 1,999 units", price: 209, savingsLabel: "₹90 off" },
      { range: "2,000 + units", price: 185, savingsLabel: "₹114 off" }
    ]
  },
  {
    id: "employee",
    slug: "employee-puja-box",
    name: "Employee Puja Box",
    subtitle: "Shubharambh Corporate Edition",
    badge: "Corporate Favourite",
    tag: "Blessings That Travel Home",
    whyHeadline: "Blessings That Travel Home",
    shortDescription:
      "A complete Ganesh puja gift for every employee — larger clay idol, full puja set, family Sankalp card and a personalised QR video greeting from your leadership.",
    kitDescription:
      "A complete Ganesh puja gift for every employee — larger clay idol, full puja set, family Sankalp card and a personalised QR video greeting from your leadership.",
    kitWho: "Employee gifting · Client appreciation · Dealer & partner gifting",
    bestFor: "Employee gifting · Client appreciation · Dealer & partner gifting",
    price: 499,
    img: "employee",
    order: 1,
    highlights: [
      { title: "Natural Clay Idol", text: "3–3.5 inch, hand-finished with devotion" },
      { title: "Complete Puja Essentials", text: "Everything needed for a meaningful puja" },
      { title: "Family Sankalp Card", text: "Invites blessings for the whole family" },
      { title: "Corporate QR Greeting", text: "A personalised video blessing per employee" }
    ],
    ledeParagraphs: [
      "A sweet box is eaten and forgotten by Friday. This one goes home, gets opened on the mat with the family, and is remembered next year.",
      "Every box carries your branding on the outer sleeve and a QR that plays a personal video greeting from your MD or founder — while the idol and devotional items stay respectfully unbranded."
    ],
    contents: [
      "3–3.5 inch natural clay Ganesha idol", "Mini reusable flower garland", "Decorative puja vastram / cloth",
      "Pasupu / Haldi", "Kumkum", "Akshata", "Cotton wicks", "Mini clay diya", "Agarbatti pack",
      "Mini sambrani cup", "Ganesh Puja Guide (booklet)", "Vinayaka Chavithi Katha card",
      "21 Names of Ganesha card", "Sealed prasadam pack (dry modak / nuts)", "Family Sankalp Card",
      "Corporate blessing card with QR greeting"
    ],
    specs: [
      { label: "Idol", value: "Natural unbaked clay, 3–3.5 inch, hand-finished" },
      { label: "Box size", value: "Approx. 300 × 230 × 90 mm, die-cut insert" },
      { label: "Branding", value: "Custom outer sleeve + greeting card + QR landing page" },
      { label: "Prasadam", value: "Sealed dry modak / dry-fruit from a licensed supplier" },
      { label: "Minimum order", value: "25 boxes for branded sleeves" },
      { label: "Lead time", value: "5–7 working days after artwork approval" }
    ],
    bulkPricing: [
      { range: "25 – 99 units", price: 449, savingsLabel: "₹50 off" },
      { range: "100 – 499 units", price: 419, savingsLabel: "₹80 off" },
      { range: "500 – 1,999 units", price: 399, savingsLabel: "₹100 off" },
      { range: "2,000 + units", price: 379, savingsLabel: "₹120 off" }
    ]
  },
  {
    id: "kids",
    slug: "bal-ganesh-kids-kit",
    name: "Bal Ganesh",
    subtitle: "My First Ganesh Chaturthi Kit",
    badge: "Best for Kids",
    tag: "Learn · Create · Pray",
    whyHeadline: "Learn · Create · Pray",
    shortDescription:
      "Story, colouring, stickers, school name labels, a little puja guide and a certificate — a festival a child experiences instead of watching.",
    kitDescription:
      "Story, colouring, stickers, school name labels, a little puja guide and a certificate — a festival a child experiences instead of watching.",
    kitWho: "Children 5–12 · Schools · Apartment communities · Birthday return gifts",
    bestFor: "Children 5–12 · Schools · Apartment communities · Birthday return gifts",
    price: 349,
    img: "kids",
    order: 2,
    highlights: [
      { title: "Bala Vinayaka Idol", text: "Cute, eco-friendly natural clay" },
      { title: "Story & Activity", text: "Learn the festival with joy, not lecture" },
      { title: "Stickers & Labels", text: "Festival stickers plus school name labels" },
      { title: "Family Puja Guide", text: "A puja the whole family does together" }
    ],
    ledeParagraphs: [
      "Children see the festival happening around them. This kit puts it in their hands — a story to read, a Ganesha to colour, stickers to stick, a rangoli to place and a puja simple enough for a six-year-old to lead.",
      "It ends with a Little Ganesha Certificate with their name on it. That certificate stays on the fridge long after visarjan."
    ],
    contents: [
      "Bal Ganesh clay idol (2.5–3 inch natural clay)", "Bal Ganesh Story Book", "Colouring & Activity Book",
      "Colour pencils / crayons (6 colours)", "Ganesh sticker sheet", "School name labels", "Mini rangoli sticker",
      "DIY paper toran", "My Little Puja Guide", "21 Names of Ganesha card", "Family Sankalp card",
      "Little Ganesha certificate"
    ],
    specs: [
      { label: "Age group", value: "5–12 years, with light adult supervision" },
      { label: "Idol", value: "Natural clay, 2.5–3 inch" },
      { label: "Books", value: "Story book + colouring & activity book" },
      { label: "Personalisation", value: "School name and logo on labels & certificate" },
      { label: "Journey", value: "Read → Create → Decorate → Pray → Celebrate" },
      { label: "School packs", value: "From 50 units with printed school branding" }
    ],
    bulkPricing: [
      { range: "25 – 99 units", price: 319, savingsLabel: "₹30 off" },
      { range: "100 – 499 units", price: 289, savingsLabel: "₹60 off" },
      { range: "500 – 1,999 units", price: 259, savingsLabel: "₹90 off" },
      { range: "2,000 + units", price: 239, savingsLabel: "₹110 off" }
    ]
  },
  {
    id: "diy",
    slug: "make-your-own-ganesha",
    name: "Make Your Own Ganesha",
    subtitle: "DIY Kids Festival Activity Kit",
    badge: "DIY Experience",
    tag: "Create · Decorate · Pray",
    whyHeadline: "Create · Decorate · Pray",
    shortDescription:
      "Natural clay, a reusable mould, child-safe colours and a six-step journey — the child makes Bappa, decorates him, prays and does an eco visarjan.",
    kitDescription:
      "Natural clay, a reusable mould, child-safe colours and a six-step journey — the child makes Bappa, decorates him, prays and does an eco visarjan.",
    kitWho: "Children 6–14 · Schools & workshops · Eco campaigns · Family activity",
    bestFor: "Children 6–14 · Schools & workshops · Eco campaigns · Family activity",
    price: 499,
    img: "diy",
    order: 3,
    highlights: [
      { title: "Natural Clay", text: "Non-toxic and kid-safe, dissolves clean" },
      { title: "Reusable Mould", text: "Use it again every year" },
      { title: "DIY Activity Fun", text: "Builds creativity and fine motor skills" },
      { title: "Family Puja Experience", text: "Bond, learn and celebrate together" }
    ],
    ledeParagraphs: [
      "There is a moment when a child realises they made the Ganesha they are praying to. That moment is the entire product.",
      "Natural clay, a reusable mould so it can be done again next year, child-safe colours, a paper toran and rangoli stencil for the little pandal, and a guided eco visarjan that turns the ending into a lesson instead of a loss."
    ],
    contents: [
      "Natural clay", "Reusable Ganesh mould", "Child-safe colours", "Paint brush", "Decorative stickers",
      "Paper toran", "Mini rangoli stencil", "Activity booklet", "Puja guide", "Certificate of achievement",
      "QR tutorial card"
    ],
    specs: [
      { label: "Age group", value: "6–14 years, light adult supervision" },
      { label: "Clay", value: "Natural, non-toxic, water soluble" },
      { label: "Mould", value: "Reusable food-grade mould" },
      { label: "Colours", value: "Child-safe water colours + brush" },
      { label: "Activity time", value: "60–90 minutes across the day" },
      { label: "Workshops", value: "School & society workshop packs from 50 units" }
    ],
    bulkPricing: [
      { range: "25 – 99 units", price: 459, savingsLabel: "₹40 off" },
      { range: "100 – 499 units", price: 429, savingsLabel: "₹70 off" },
      { range: "500 – 1,999 units", price: 389, savingsLabel: "₹110 off" },
      { range: "2,000 + units", price: 359, savingsLabel: "₹140 off" }
    ],
    processSteps: {
      eyebrow: "The six-step journey",
      headline: "Make it. Decorate it. Pray with it.",
      steps: [
        { title: "Make Ganesha", text: "Press the natural clay into the reusable mould." },
        { title: "Decorate Ganesha", text: "Child-safe colours, brush and decorative stickers." },
        { title: "Build Mini Pandal", text: "Paper toran and rangoli stencil set the stage." },
        { title: "Perform Puja", text: "The illustrated puja guide walks them through it." },
        { title: "Eco Visarjan", text: "A clean, guided immersion at home." },
        { title: "Get Your Certificate", text: "Proud Little Creator — with their name on it." }
      ]
    }
  },
  {
    id: "mandap",
    slug: "gruha-ganapathi-mandap",
    name: "Gruha Ganapathi",
    subtitle: "Instant Mandap Kit",
    badge: "10-Minute Setup",
    tag: "Your Ganesh Chaturthi setup in 10 minutes",
    whyHeadline: "Your Ganesh Chaturthi setup in 10 minutes",
    shortDescription:
      "A flat-pack mandap that opens, slots, locks and decorates — four pillars, canopy, chakra back panel, flower hooks and LED provision. No tools, no carpenter.",
    kitDescription:
      "A flat-pack mandap that opens, slots, locks and decorates — four pillars, canopy, chakra back panel, flower hooks and LED provision. No tools, no carpenter.",
    kitWho: "Households · Apartments · Shops & showrooms · Association halls",
    bestFor: "Households · Apartments · Shops & showrooms · Association halls",
    price: 699,
    img: "mandap",
    order: 4,
    variants: [
      { id: "mini", name: "Mini Mandap", price: 699, note: "Ideal for apartments & small spaces · Up to 12 inch idols" },
      { id: "family", name: "Family Mandap", price: 1299, note: "Perfect for homes & family pujas · Up to 18 inch idols" },
      { id: "premium", name: "Premium Mandap", price: 1999, note: "Grand setup for festivals & celebrations · Up to 24 inch idols" }
    ],
    highlights: [
      { title: "No Tools Needed", text: "Just your hands and devotion" },
      { title: "Flat Pack Design", text: "Compact box, easy to store and re-use" },
      { title: "Easy Assembly", text: "A quick four-step setup" },
      { title: "Reusable", text: "Durable and sturdy for years" }
    ],
    ledeParagraphs: [
      "Every year the same scramble: bamboo, thermocol, a borrowed table, and something that never quite looks right. This replaces all of it with one flat box.",
      "Open it, slot the pillars, lock the canopy, hang the flowers. Ten minutes later you have a mandap that looks like it took a decorator a day — and it folds away to be used again next year."
    ],
    contents: [
      "Four pillars", "Top canopy", "Base / stool platform", "Back panel", "Half-moon / chakra design",
      "Flower hooks", "Toran hooks", "Side décor panels", "Small rangoli stencil", "LED provision",
      "Assembly diagram / QR guide"
    ],
    specs: [
      { label: "Material", value: "Engineered wood, laser-cut, decorative finish" },
      { label: "Assembly", value: "Tool-free interlocking — Open · Slot · Lock · Decorate" },
      { label: "Sizes", value: 'Mini (12"), Family (18"), Premium (24") idol capacity' },
      { label: "Lighting", value: "LED provision built in; warm LED string included" },
      { label: "Packing", value: "Flat-pack self-shipper carton" },
      { label: "Compatible", value: "Fits the Sonic Rotating Chakra Backdrop range" }
    ],
    bulkPricing: [
      { range: "10 – 49 units", price: 649, savingsLabel: "₹50 off" },
      { range: "50 – 199 units", price: 599, savingsLabel: "₹100 off" },
      { range: "200 – 499 units", price: 549, savingsLabel: "₹150 off" },
      { range: "500 + units", price: 499, savingsLabel: "₹200 off" }
    ],
    processSteps: {
      eyebrow: "The four-step setup",
      headline: "Open · Slot · Lock · Decorate",
      steps: [
        { title: "Open", text: "Lift the flat-pack panels out of the box." },
        { title: "Slot", text: "Slide the four pillars into the base platform." },
        { title: "Lock", text: "Drop the canopy and back panel into place." },
        { title: "Decorate", text: "Hang flowers, toran and the LED string." }
      ]
    }
  },
  {
    id: "chakra",
    slug: "rotating-chakra-backdrop",
    name: "Motorized Rotating Chakra",
    subtitle: "Moving Backdrop for Ganesh Mandaps",
    badge: "Sonic Signature",
    tag: "Devotion in motion. A sacred presence in stillness.",
    whyHeadline: "Devotion in motion. A sacred presence in stillness.",
    shortDescription:
      "A laser-cut backdrop whose centre chakra turns slowly behind Bappa while the outer frame stays still — a living halo of light, depth and devotion.",
    kitDescription:
      "A laser-cut backdrop whose centre chakra turns slowly behind Bappa while the outer frame stays still — a living halo of light, depth and devotion.",
    kitWho: "Homes · Societies · Shops & showrooms · Events & pandals",
    bestFor: "Homes · Societies · Shops & showrooms · Events & pandals",
    price: 999,
    img: "chakra-classic",
    order: 5,
    variants: [
      { id: "mini", name: "Mini", price: 999, note: "For home mandaps and small idols" },
      { id: "family", name: "Family", price: 1499, note: "For family mandaps and shop counters" },
      { id: "premium", name: "Premium", price: 2499, note: "For societies, events and pandals" }
    ],
    designs: [
      { id: "premium-circle", name: "Premium Circle", img: "chakra-classic", sheet: "chakra-classic-sheet", note: "The signature circular halo with a rotating centre chakra." },
      { id: "lotus-chakra", name: "Lotus Chakra", img: "chakra-lotus", sheet: "chakra-lotus-sheet", note: "Intricate lotus layers with a fine laser-cut petal finish." },
      { id: "temple-aura", name: "Temple Aura", img: "chakra-temple", sheet: "chakra-temple-sheet", note: "A temple arch frame around a glowing rotating aura." },
      { id: "floral-mandala", name: "Floral Mandala", img: "chakra-floral", sheet: "chakra-floral-sheet", note: "A rich floral mandala for a grand, luxurious presence." },
      { id: "crescent-moon", name: "Crescent Moon", img: "chakra-moon", sheet: "chakra-moon-sheet", note: "A celestial crescent frame with a rotating mandala centre." },
      { id: "divine-lotus", name: "Divine Lotus", img: "chakra-lotus", sheet: "chakra-lotus-sheet", note: "A radiant sunburst lotus in a petal-cut frame." }
    ],
    highlights: [
      { title: "360° Rotating Centre", text: "Smooth, continuous, mesmerising motion" },
      { title: "Concealed Silent Motor", text: "Whisper-quiet, uninterrupted darshan" },
      { title: "Easy Fit Behind Idol", text: "Sturdy bracket, secure and wobble-free" },
      { title: "Warm LED Glow", text: "Soft golden backlight that adds depth" }
    ],
    ledeParagraphs: [
      "The outer ring stays perfectly still. The centre turns — slowly, silently, endlessly — and the whole mandap comes alive. People stop walking past. They stand and watch.",
      "A concealed high-torque motor, warm LED backlighting and precision laser-cut layers in engineered wood and acrylic. It fits behind an idol of almost any size, sets up without tools, and packs away for next year."
    ],
    contents: [
      "Front decorative ring", "Rotating chakra disk", "Concealed silent motor", "Support bracket / rear stand",
      "Power adapter", "Warm LED provision", "Fitting hardware", "Setup guide"
    ],
    specs: [
      { label: "Material", value: "Engineered wood and premium acrylic, laser-cut" },
      { label: "Motor", value: "High-torque concealed silent motor" },
      { label: "Rotation", value: "Smooth continuous 360° centre rotation" },
      { label: "Power", value: "Plug & play adapter, standard Indian socket" },
      { label: "Lighting", value: "Warm LED backlight provision" },
      { label: "Designs", value: "Six signature designs, three sizes each" }
    ],
    bulkPricing: [
      { range: "10 – 49 units", price: 949, savingsLabel: "₹50 off" },
      { range: "50 – 199 units", price: 899, savingsLabel: "₹100 off" },
      { range: "200 – 499 units", price: 849, savingsLabel: "₹150 off" },
      { range: "500 + units", price: 799, savingsLabel: "₹200 off" }
    ]
  }
];
