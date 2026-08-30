import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { autoSeed } from "./utils/autoSeed.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    await autoSeed();
    app.listen(PORT, () => {
      console.log(`[server] Sonic Prints API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[server] Failed to start:", err.message);
    process.exit(1);
  }
}

start();
