const createCrudController = (Model, options = {}) => {
  const { populate = [] } = options;

  const buildQuery = () => {
    let query = Model.find();
    populate.forEach((field) => {
      query = query.populate(field);
    });
    return query;
  };

  return {
    create: async (req, res) => {
      try {
        const nuevo = await Model.create(req.body);
        return res.status(201).json(nuevo);
      } catch (error) {
        return res.status(400).json({ message: "Error al crear documento", error: error.message });
      }
    },

    list: async (_req, res) => {
      try {
        const data = await buildQuery();
        return res.json(data);
      } catch (error) {
        return res.status(500).json({ message: "Error al listar documentos", error: error.message });
      }
    },

    getById: async (req, res) => {
      try {
        let query = Model.findById(req.params.id);
        populate.forEach((field) => {
          query = query.populate(field);
        });

        const item = await query;
        if (!item) {
          return res.status(404).json({ message: "Documento no encontrado" });
        }
        return res.json(item);
      } catch (error) {
        return res.status(400).json({ message: "Error al buscar documento", error: error.message });
      }
    },

    update: async (req, res) => {
      try {
        const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
        });
        if (!updated) {
          return res.status(404).json({ message: "Documento no encontrado" });
        }
        return res.json(updated);
      } catch (error) {
        return res.status(400).json({ message: "Error al actualizar documento", error: error.message });
      }
    },

    remove: async (req, res) => {
      try {
        const deleted = await Model.findByIdAndDelete(req.params.id);
        if (!deleted) {
          return res.status(404).json({ message: "Documento no encontrado" });
        }
        return res.json({ message: "Documento eliminado correctamente" });
      } catch (error) {
        return res.status(400).json({ message: "Error al eliminar documento", error: error.message });
      }
    }
  };
};

module.exports = createCrudController;
