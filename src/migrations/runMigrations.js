require("dotenv").config();
const { MongoClient } = require("mongodb");

const migrations = [
  require("./001-create-collections"),
  require("./002-seed-data")
];

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME || "proyecto_biblioteca";
  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const migrationCollection = db.collection("migrations");

    for (const migration of migrations) {
      const applied = await migrationCollection.findOne({ name: migration.name });
      if (applied) {
        console.log(`Saltando ${migration.name}: ya aplicada.`);
        continue;
      }

      console.log(`Ejecutando ${migration.name}...`);
      await migration.up(db);
      await migrationCollection.insertOne({
        name: migration.name,
        executedAt: new Date()
      });
      console.log(`Aplicada: ${migration.name}`);
    }

    console.log("Migraciones completadas.");
  } catch (error) {
    console.error("Error al ejecutar migraciones:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
};

run();
