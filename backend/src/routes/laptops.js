const express = require("express");
const { z } = require("zod");
const { Laptop } = require("../models/Laptop");

const router = express.Router();

const createLaptopSchema = z.object({
  externalId: z.number().int().min(1),
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  priceUSD: z.number().min(0),
  stock: z.number().int().min(0).optional(),
  imageUrl: z.string().url().optional()
});

router.get("/", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const limit = req.query.limit ? Math.min(48, Math.max(1, Number(req.query.limit))) : 12;

    const filter = {};
    if (q) {
      filter.$text = { $search: q };
    }
    if (category) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Laptop.find(filter)
        .sort({ createdAt: -1 })
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
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createLaptopSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
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
      return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
    }

    const updated = await Laptop.findByIdAndUpdate(req.params.id, parsed.data, { new: true }).lean();
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deleted = await Laptop.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = { laptopsRouter: router };

