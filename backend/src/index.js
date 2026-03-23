const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToMongo } = require("./db");
const { laptopsRouter } = require("./routes/laptops");
const { metaRouter } = require("./routes/meta");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) : true,
    credentials: false
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Laptop Web API đang chạy" });
});

app.use("/api/laptops", laptopsRouter);
app.use("/api/meta", metaRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy API" });
});

app.use((err, req, res, next) => {
  const status = typeof err.status === "number" ? err.status : 500;
  const message = status === 500 ? "Lỗi máy chủ" : err.message;
  res.status(status).json({ message });
});

async function start() {
  const port = Number(process.env.PORT || 4000);
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/laptop_web_simple";
  await connectToMongo(mongoUri);
  app.listen(port, () => {
    process.stdout.write(`Backend đang chạy: http://localhost:${port}\n`);
  });
}

start().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`);
  process.exit(1);
});

