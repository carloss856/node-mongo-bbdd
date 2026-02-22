const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, unique: true, trim: true },
    descripcion: { type: String, required: true, trim: true },
    nivel: { type: String, required: true, enum: ["Basico", "Intermedio", "Avanzado"] },
    activa: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categoria", categoriaSchema, "categorias");
