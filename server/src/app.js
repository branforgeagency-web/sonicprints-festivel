import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import enquiryRoutes from "./routes/enquiries.js";
import authRoutes from "./routes/auth.js";
import configRoutes from "./routes/config.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Basic abuse protection on the routes that write to the DB / send WhatsApp intents.
const writeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(["/api/orders", "/api/enquiries", "/api/auth/login"], writeLimiter);

app.get("/api/health", (req, res) => res.json({ ok: true, service: "sonic-prints-api" }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/config", configRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
