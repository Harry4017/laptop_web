const mongoose = require("mongoose");

const LaptopSchema = new mongoose.Schema(
  {
    ten: { type: String, required: true, trim: true },
    danhMuc: { type: String, required: true, trim: true, default: "Laptop" },
    hang: { type: String, required: true, trim: true },
    cpu: { type: String, required: true, trim: true },
    ramGB: { type: Number, required: true, min: 1 },
    oCung: { type: String, required: true, trim: true },
    manHinh: { type: String, required: true, trim: true },
    cardDoHoa: { type: String, required: true, trim: true },
    giaVND: { type: Number, required: true, min: 0 },
    tonKho: { type: Number, required: true, min: 0, default: 0 },
    hinhAnhUrl: { type: String, trim: true },
    moTa: { type: String, trim: true }
  },
  { timestamps: true }
);

LaptopSchema.index({ ten: "text", danhMuc: "text", hang: "text", cpu: "text", oCung: "text" });

const Laptop = mongoose.model("Laptop", LaptopSchema);

module.exports = { Laptop };

