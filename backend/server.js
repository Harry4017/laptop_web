const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");

const { connectToMongo } = require("./src/db");
const { laptopsRouter } = require("./src/routes/laptops");
const { metaRouter } = require("./src/routes/meta");
const { productsSeed } = require("./src/data/products");

dotenv.config();

function createMemoryRouter() {
  const router = express.Router();

  router.get("/laptops", (req, res) => {
    const q = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim().toLowerCase() : "";
    const page = req.query.page ? Math.max(1, Number(req.query.page)) : 1;
    const limit = req.query.limit ? Math.min(48, Math.max(1, Number(req.query.limit))) : 12;

    let items = [...productsSeed];
    if (q) {
      items = items.filter((x) => String(x.name || "").toLowerCase().includes(q));
    }
    if (category) {
      items = items.filter((x) => String(x.category || "").toLowerCase() === category);
    }

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paged = items.slice(start, start + limit).map((x, idx) => ({
      _id: `mem_${x.externalId}`,
      ...x,
      createdAt: new Date(Date.now() - idx * 1000).toISOString(),
      updatedAt: new Date(Date.now() - idx * 1000).toISOString()
    }));

    res.json({ items: paged, page, limit, total, totalPages });
  });

  router.get("/laptops/:id", (req, res) => {
    const id = String(req.params.id || "");
    const externalId = id.startsWith("mem_") ? Number(id.replace("mem_", "")) : Number(id);
    const item = productsSeed.find((x) => x.externalId === externalId);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ _id: `mem_${item.externalId}`, ...item });
  });

  router.get("/meta/categories", (req, res) => {
    const categories = Array.from(new Set(productsSeed.map((x) => x.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, "en"));
    res.json({ categories });
  });

  return router;
}

async function start() {
  const port = Number(process.env.PORT || 5000);
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/laptop_web_simple";

  const app = express();
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : true,
      credentials: false
    })
  );
  app.use(express.json({ limit: "1mb" }));

  let useMongo = true;
  try {
    await connectToMongo(mongoUri);
  } catch (e) {
    useMongo = false;
    process.stderr.write(`${e?.message || e}\n`);
  }

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, mode: useMongo ? "mongo" : "memory" });
  });

  if (useMongo) {
    app.use("/api/laptops", laptopsRouter);
    app.use("/api/meta", metaRouter);
  } else {
    app.use("/api", createMemoryRouter());
  }

  app.use((req, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use((err, req, res, next) => {
    const status = typeof err.status === "number" ? err.status : 500;
    const message = status === 500 ? "Server error" : err.message;
    res.status(status).json({ message });
  });

  app.listen(port, () => {
    process.stdout.write(`Backend running: http://localhost:${port}\n`);
  });
}

start().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`);
  process.exit(1);
});

