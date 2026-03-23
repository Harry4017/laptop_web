const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

async function migrateCollection(sourceConn, targetConn, collectionName) {
  const sourceCol = sourceConn.db.collection(collectionName);
  const targetCol = targetConn.db.collection(collectionName);

  const docs = await sourceCol.find({}).toArray();
  if (docs.length === 0) {
    process.stdout.write(`Không có dữ liệu trong collection "${collectionName}".\n`);
    return 0;
  }

  const ops = docs.map((doc) => ({
    replaceOne: {
      filter: { _id: doc._id },
      replacement: doc,
      upsert: true
    }
  }));

  await targetCol.bulkWrite(ops, { ordered: false });
  return docs.length;
}

async function run() {
  const sourceUri =
    process.env.SOURCE_MONGODB_URI || "mongodb://127.0.0.1:27017/laptop_web";
  const targetUri =
    process.env.TARGET_MONGODB_URI || "mongodb://127.0.0.1:27017/laptop_web_simple";

  const sourceConn = await mongoose.createConnection(sourceUri).asPromise();
  const targetConn = await mongoose.createConnection(targetUri).asPromise();

  try {
    const count = await migrateCollection(sourceConn, targetConn, "laptops");
    process.stdout.write(
      `Đã chuyển ${count} bản ghi sang database mới.\n`
    );
  } finally {
    await Promise.allSettled([sourceConn.close(), targetConn.close()]);
  }
}

run().catch((e) => {
  process.stderr.write(`${e?.message || e}\n`);
  process.exit(1);
});

