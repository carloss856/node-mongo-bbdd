module.exports = {
  name: "001-create-collections",
  up: async (db) => {
    const collections = await db.listCollections().toArray();
    const existing = new Set(collections.map((c) => c.name));

    const requiredCollections = ["autores", "categorias", "usuarios", "libros", "prestamos"];

    for (const collectionName of requiredCollections) {
      if (!existing.has(collectionName)) {
        await db.createCollection(collectionName);
      }
    }

    await db.collection("usuarios").createIndex({ email: 1 }, { unique: true });
    await db.collection("categorias").createIndex({ nombre: 1 }, { unique: true });
    await db.collection("libros").createIndex({ isbn: 1 }, { unique: true });
    await db.collection("prestamos").createIndex({ usuarioId: 1, libroId: 1, fechaPrestamo: -1 });
  }
};
