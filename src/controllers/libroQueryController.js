const Libro = require("../models/libro.model");

const obtenerLibrosStockBajo = async (req, res) => {
  try {
    const maxStock = Number(req.query.maxStock || 2);

    const libros = await Libro.find({ stock: { $lte: maxStock } })
      .populate("autorId")
      .populate("categoriaId");

    return res.json({
      criterio: `stock <= ${maxStock}`,
      total: libros.length,
      resultados: libros
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error en consulta de libros con stock bajo",
      error: error.message
    });
  }
};

module.exports = {
  obtenerLibrosStockBajo
};
