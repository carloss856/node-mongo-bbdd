const mongoose = require("mongoose");

const autorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    pais: { type: String, required: true, trim: true },
    anioNacimiento: { type: Number, required: true },
    generoLiterario: { type: String, required: true, trim: true },
    activo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Autor", autorSchema, "autores");
