const mongoose = require("mongoose");

const prestamoSchema = new mongoose.Schema(
  {
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    libroId: { type: mongoose.Schema.Types.ObjectId, ref: "Libro", required: true },
    fechaPrestamo: { type: Date, required: true },
    fechaVencimiento: { type: Date, required: true },
    estado: { type: String, required: true, enum: ["Activo", "Devuelto", "Atrasado"] },
    multa: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prestamo", prestamoSchema, "prestamos");
