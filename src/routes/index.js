const express = require("express");
const createCrudController = require("../controllers/createCrudController");
const createCrudRouter = require("./createCrudRouter");
const { obtenerLibrosStockBajo } = require("../controllers/libroQueryController");

const Autor = require("../models/autor.model");
const Categoria = require("../models/categoria.model");
const Usuario = require("../models/usuario.model");
const Libro = require("../models/libro.model");
const Prestamo = require("../models/prestamo.model");

const apiRouter = express.Router();
const librosRouter = express.Router();
const libroCrudController = createCrudController(Libro, { populate: ["autorId", "categoriaId"] });

apiRouter.use("/autores", createCrudRouter(createCrudController(Autor)));
apiRouter.use("/categorias", createCrudRouter(createCrudController(Categoria)));
apiRouter.use("/usuarios", createCrudRouter(createCrudController(Usuario)));

librosRouter.get("/consulta/stock-bajo", obtenerLibrosStockBajo);
librosRouter.post("/", libroCrudController.create);
librosRouter.get("/", libroCrudController.list);
librosRouter.get("/:id", libroCrudController.getById);
librosRouter.put("/:id", libroCrudController.update);
librosRouter.delete("/:id", libroCrudController.remove);

apiRouter.use("/libros", librosRouter);
apiRouter.use(
  "/prestamos",
  createCrudRouter(createCrudController(Prestamo, { populate: ["usuarioId", "libroId"] }))
);

module.exports = apiRouter;
