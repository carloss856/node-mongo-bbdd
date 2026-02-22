const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "proyecto_biblioteca";

  await mongoose.connect(mongoUri, { dbName });
  console.log(`MongoDB conectado en base de datos: ${dbName}`);
};

module.exports = {
  connectDB
};
