import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set. Copy server/.env.example to server/.env and fill it in.");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log(`[db] connected → ${mongoose.connection.name}`);

  // Auto-clean legacy 'id_1' unique index from MongoDB orders collection if present
  try {
    const ordersCol = mongoose.connection.db.collection("orders");
    const indexes = await ordersCol.indexes();
    if (indexes.some((idx) => idx.name === "id_1")) {
      await ordersCol.dropIndex("id_1");
      console.log("[db] Safely removed legacy 'id_1' index from orders collection.");
    }
  } catch {
    // Collection or index does not exist yet — safe to ignore
  }

  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err.message);
  });
}
