const express = require("express");
const { Laptop } = require("../models/Laptop");

const router = express.Router();

router.get("/hangs", async (req, res, next) => {
  try {
    const hangs = await Laptop.distinct("hang");
    hangs.sort((a, b) => a.localeCompare(b, "vi"));
    res.json({ hangs });
  } catch (err) {
    next(err);
  }
});

module.exports = { metaRouter: router };

