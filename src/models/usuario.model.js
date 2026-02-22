const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rol: { type: String, required: true, enum: ["Estudiante", "Docente", "Administrador"] },
    activo: { type: Boolean, default: true },
    fechaRegistro: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", usuarioSchema, "usuarios");
