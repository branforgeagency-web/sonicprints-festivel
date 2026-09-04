import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export async function getNextOrderId() {
  const counter = await Counter.findByIdAndUpdate(
    "orderId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const formattedSeq = String(counter.seq).padStart(3, "0");
  return `#SONIC${formattedSeq}`;
}

export default Counter;
