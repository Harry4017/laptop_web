const express = require("express");
const { z } = require("zod");
const { Laptop } = require("../models/Laptop");

const router = express.Router();

const createLaptopSchema = z.object({
  ten: z.string().min(1),
  danhMuc: z.string().min(1).optional(),
  hang: z.string().min(1),
  cpu: z.string().min(1),
  ramGB: z.number().int().min(1),
  oCung: z.string().min(1),
  manHinh: z.string().min(1),
  cardDoHoa: z.string().min(1),
  giaVND: z.number().int().min(0),
  tonKho: z.number().int().min(0).optional(),
  hinhAnhUrl: z.string().url().optional(),
  moTa: z.string().optional()
});

router.get("/", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const hang = typeof req.query.hang === "string" ? req.query.hang.trim() : "";
    const minGia = req.query.minGia ? Number(req.query.minGia) : undefined;
    const maxGia = req.query.maxGia ? Number(req.query.maxGia) : undefined;
    const sort = typeof req.query.sort === "string" ? req.query.sort : "moiNhat";
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const limit = req.query.limit ? Math.min(48, Math.max(1, Number(req.query.limit))) : 12;

    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (hang) {
      filter.hang = hang;
    }
    if (typeof minGia === "number" || typeof maxGia === "number") {
      filter.giaVND = {};
      if (typeof minGia === "number" && !Number.isNaN(minGia)) filter.giaVND.$gte = minGia;
      if (typeof maxGia === "number" && !Number.isNaN(maxGia)) filter.giaVND.$lte = maxGia;
    }

    const sortMap = {
      moiNhat: { createdAt: -1 },
      giaTang: { giaVND: 1 },
      giaGiam: { giaVND: -1 },
      tonKho: { tonKho: -1 }
    };

    const [items, total] = await Promise.all([
      Laptop.find(filter)
        .sort(sortMap[sort] || sortMap.moiNhat)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Laptop.countDocuments(filter)
    ]);

    res.json({
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Laptop.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createLaptopSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", issues: parsed.error.issues });
    }

    const created = await Laptop.create(parsed.data);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const parsed = createLaptopSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", issues: parsed.error.issues });
    }

    const updated = await Laptop.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Laptop.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ message: "Đã xoá sản phẩm" });
  } catch (err) {
    next(err);
  }
});

module.exports = { laptopsRouter: router };

