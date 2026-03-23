const dotenv = require("dotenv");
const { connectToMongo } = require("./db");
const { Laptop } = require("./models/Laptop");
const { productsSeed } = require("./data/products");

dotenv.config();

async function run() {
  await connectToMongo(process.env.MONGODB_URI);
  await Laptop.deleteMany({});
  await Laptop.insertMany(productsSeed);
  process.stdout.write(`Đã seed ${productsSeed.length} sản phẩm.\n`);
  process.exit(0);
}

run().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`);
  process.exit(1);
});

