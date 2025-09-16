import mongoose from "mongoose";

const activeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenId: { type: String, required: true, unique: true },
  expirationDate: { type: Date, required: true },
  userAgent: String, 
  ip: String,
  createdAt: { type: Date, default: Date.now }
});

const Active = mongoose.model("Active", activeSchema);

export default Active;
