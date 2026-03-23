const mongoose = require("mongoose");

const LaptopSchema = new mongoose.Schema(
  {
    externalId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "Laptop" },
    priceUSD: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

LaptopSchema.index({ name: "text", category: "text" });

const Laptop = mongoose.model("Laptop", LaptopSchema);

module.exports = { Laptop };

