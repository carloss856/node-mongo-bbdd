const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    anioPublicacion: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    precio: { type: Number, required: true, min: 0 },
    autorId: { type: mongoose.Schema.Types.ObjectId, ref: "Autor", required: true },
    categoriaId: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Libro", libroSchema, "libros");
