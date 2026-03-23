const mongoose = require("mongoose");

async function connectToMongo(mongoUri) {
  const uri = mongoUri || "mongodb://127.0.0.1:27017/laptop_web_simple";

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
}

module.exports = { connectToMongo };

