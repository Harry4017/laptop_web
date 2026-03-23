const express = require("express");
const { Laptop } = require("../models/Laptop");

const router = express.Router();

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Laptop.distinct("category");
    categories.sort((a, b) => a.localeCompare(b, "en"));
    res.json({ categories });
  } catch (err) {
    next(err);
  }
});

module.exports = { metaRouter: router };

