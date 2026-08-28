# Sonic Prints — Ganesh Festival Collection 2026 (MERN)

A full MERN rebuild of the original single-file storefront: **M**ongoDB + **E**xpress + **R**eact + **N**ode.
Products, orders and bulk enquiries are now stored in a real database and managed from an admin panel,
instead of living in a hardcoded JS object and `localStorage`.

## What changed vs. the original static site

- **Products** (all 6 kits, with variants/designs/pricing/specs) now live in MongoDB and are served by a
  REST API, instead of a hardcoded `SONIC_CATALOG` object in the page's `<script>` tag.
- **Cart** still lives in the browser (`localStorage`, same as before) for a snappy no-login shopping
  experience, but every price shown is fetched from the live product data.
- **Checkout** posts the order to the API, which recalculates the total server-side (never trusts the
  browser's numbers), saves it to MongoDB, and returns a ready-to-send WhatsApp message — same
  "confirm on WhatsApp" flow as before, now with a permanent record of every order.
- **Bulk enquiries** are saved to MongoDB in addition to opening WhatsApp.
- **Admin panel** (`/admin`) — sign in to see every order and enquiry, update their status, edit product
  prices/descriptions, and change site-wide settings (WhatsApp number, phone, shipping rules, etc.)
  without touching code.
- **Optional Razorpay** online payment is still supported (create-order + signature verification now
  happen on the server, which is required for real payments — the original site's placeholder for this
  needed a backend, and now it has one).

## Project layout

```
sonic-prints-mern/
├── server/                 Express + MongoDB API
│   ├── src/
│   │   ├── models/         Product, Order, Enquiry, Admin, SiteConfig
│   │   ├── controllers/    Route handlers
│   │   ├── routes/         /api/products, /api/orders, /api/enquiries, /api/auth, /api/config
│   │   ├── middleware/     JWT admin auth, error handling
│   │   └── app.js, server.js
│   └── seed/                Seeds the 6-product catalog + first admin user
├── client/                 React (Vite) storefront + admin panel
│   └── src/
│       ├── pages/           Home, ProductPage, Bulk, Checkout, OrderConfirmation, admin/*
│       ├── components/      Header, Footer, CartDrawer, KitCard, FaqAccordion, ...
│       ├── context/         SiteContext (products+config), CartContext, ToastContext, AdminAuthContext
│       ├── data/content.js  Static marketing copy (FAQ, audience cards, bulk segments, etc.)
│       └── styles/site.css  The original site's CSS, ported as-is (fonts are embedded, no external requests)
└── package.json             Root scripts to run both together
```

## Prerequisites

- Node.js 18+ and npm
- A MongoDB database — either:
  - **Local**: install MongoDB Community Server and run it (`mongod`), or
  - **Atlas** (free tier is fine): create a cluster at mongodb.com/atlas and copy its connection string

## Setup

```bash
# 1. Install dependencies for both server and client
npm run install:all

# 2. Configure the server
cp server/.env.example server/.env
# edit server/.env — at minimum set MONGO_URI, and a real JWT_SECRET.
# ADMIN_EMAIL / ADMIN_PASSWORD are used once, to create your first admin login.

# 3. (optional) Configure the client — only needed if the API won't be at /api on the same host
cp client/.env.example client/.env

# 4. Seed the database — creates the 6 products, default site settings, and the first admin user
npm run seed

# 5. Run both server (port 5000) and client (port 5173) together
npm run dev
```

Open http://localhost:5173 for the storefront and http://localhost:5173/admin/login for the admin panel
(sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `server/.env` before seeding).

**Change the WhatsApp number, phone, email etc.** either in `server/.env` before you seed, or afterwards
from **Admin → Site settings** — the latter takes effect immediately, no redeploy needed.

## Going live with real payments (optional)

The site works perfectly well with WhatsApp-only checkout (the default). To turn on "Pay online now":

1. Get your Key ID and Key Secret from the Razorpay dashboard.
2. Add both to `server/.env` (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`), or paste just the Key ID into
   **Admin → Site settings → Razorpay Key ID** (the secret must stay server-side, in `.env`, either way).
3. Restart the server. The "Pay online now" option enables itself automatically once a key is present.

## Running the pieces separately

```bash
npm run server   # just the API, with auto-reload (nodemon)
npm run client   # just the Vite dev server
npm run seed     # re-run the seed (safe to run again — it upserts by product id / email)
npm run build    # production build of the client (client/dist)
npm start        # run the API in production mode (no auto-reload)
```

## Deploying

- **Server**: deploy `server/` to any Node host (Render, Railway, a VPS, etc.). Set the same environment
  variables as `.env`, pointing `MONGO_URI` at your production database and `CLIENT_ORIGIN` at your
  deployed frontend's URL (comma-separate if there's more than one).
- **Client**: `npm run build` inside `client/` produces a static `dist/` folder — deploy it to any static
  host (Vercel, Netlify, S3+CloudFront, or served by the Node server itself with `express.static`). Set
  `VITE_API_URL` to your deployed API's base URL before building.
- Product photos live in `client/public/assets/img` and are bundled with the client build; there's no
  separate media server to configure.

## Notes

- The admin panel's product editor exposes the simple fields (name, price, description, etc.) as normal
  form fields, and the structured bits (highlights, specs, bulk-pricing tiers, variants, designs, "inside
  the box" contents, optional step-by-step process) as JSON — this keeps one editor working for every
  product without needing a bespoke sub-form for each kit's slightly different shape. If that ever feels
  limiting, it's a good next place to invest in a friendlier UI.
- Order totals are always recomputed server-side from the current product prices at checkout time — the
  cart in the browser is only ever a shopping list, never a source of truth for money.
