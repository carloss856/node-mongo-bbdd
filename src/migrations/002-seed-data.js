const { ObjectId } = require("mongodb");

module.exports = {
  name: "002-seed-data",
  up: async (db) => {
    const autoresCount = await db.collection("autores").countDocuments();
    const categoriasCount = await db.collection("categorias").countDocuments();
    const usuariosCount = await db.collection("usuarios").countDocuments();
    const librosCount = await db.collection("libros").countDocuments();
    const prestamosCount = await db.collection("prestamos").countDocuments();

    if (autoresCount + categoriasCount + usuariosCount + librosCount + prestamosCount > 0) {
      console.log("Seed omitido: ya existen datos en una o mas colecciones.");
      return;
    }

    const autores = [
      {
        _id: new ObjectId(),
        nombre: "Gabriel Garcia Marquez",
        pais: "Colombia",
        anioNacimiento: 1927,
        generoLiterario: "Realismo magico",
        activo: false
      },
      {
        _id: new ObjectId(),
        nombre: "Isabel Allende",
        pais: "Chile",
        anioNacimiento: 1942,
        generoLiterario: "Novela historica",
        activo: true
      },
      {
        _id: new ObjectId(),
        nombre: "Mario Vargas Llosa",
        pais: "Peru",
        anioNacimiento: 1936,
        generoLiterario: "Narrativa",
        activo: true
      },
      {
        _id: new ObjectId(),
        nombre: "Julio Cortazar",
        pais: "Argentina",
        anioNacimiento: 1914,
        generoLiterario: "Cuento",
        activo: false
      }
    ];

    const categorias = [
      {
        _id: new ObjectId(),
        nombre: "Literatura Latinoamericana",
        descripcion: "Obras clasicas y contemporaneas de autores latinos",
        nivel: "Avanzado",
        activa: true
      },
      {
        _id: new ObjectId(),
        nombre: "Novela",
        descripcion: "Narraciones extensas de ficcion",
        nivel: "Intermedio",
        activa: true
      },
      {
        _id: new ObjectId(),
        nombre: "Cuento",
        descripcion: "Relatos cortos y antologias",
        nivel: "Basico",
        activa: true
      },
      {
        _id: new ObjectId(),
        nombre: "Ensayo",
        descripcion: "Textos argumentativos y reflexivos",
        nivel: "Intermedio",
        activa: true
      }
    ];

    const usuarios = [
      {
        _id: new ObjectId(),
        nombre: "Ana Perez",
        email: "ana.perez@correo.com",
        rol: "Estudiante",
        activo: true,
        fechaRegistro: new Date("2026-01-05")
      },
      {
        _id: new ObjectId(),
        nombre: "Luis Torres",
        email: "luis.torres@correo.com",
        rol: "Docente",
        activo: true,
        fechaRegistro: new Date("2026-01-07")
      },
      {
        _id: new ObjectId(),
        nombre: "Maria Rojas",
        email: "maria.rojas@correo.com",
        rol: "Estudiante",
        activo: true,
        fechaRegistro: new Date("2026-01-10")
      },
      {
        _id: new ObjectId(),
        nombre: "Carlos Medina",
        email: "carlos.medina@correo.com",
        rol: "Administrador",
        activo: true,
        fechaRegistro: new Date("2026-01-12")
      }
    ];

    const libros = [
      {
        _id: new ObjectId(),
        titulo: "Cien anos de soledad",
        isbn: "9780307474728",
        anioPublicacion: 1967,
        stock: 2,
        precio: 19.99,
        autorId: autores[0]._id,
        categoriaId: categorias[0]._id
      },
      {
        _id: new ObjectId(),
        titulo: "La casa de los espiritus",
        isbn: "9781501117015",
        anioPublicacion: 1982,
        stock: 5,
        precio: 17.5,
        autorId: autores[1]._id,
        categoriaId: categorias[1]._id
      },
      {
        _id: new ObjectId(),
        titulo: "La ciudad y los perros",
        isbn: "9788420454863",
        anioPublicacion: 1963,
        stock: 1,
        precio: 15.25,
        autorId: autores[2]._id,
        categoriaId: categorias[1]._id
      },
      {
        _id: new ObjectId(),
        titulo: "Final del juego",
        isbn: "9788437601120",
        anioPublicacion: 1956,
        stock: 3,
        precio: 13,
        autorId: autores[3]._id,
        categoriaId: categorias[2]._id
      }
    ];

    const prestamos = [
      {
        _id: new ObjectId(),
        usuarioId: usuarios[0]._id,
        libroId: libros[0]._id,
        fechaPrestamo: new Date("2026-02-10"),
        fechaVencimiento: new Date("2026-02-20"),
        estado: "Devuelto",
        multa: 0
      },
      {
        _id: new ObjectId(),
        usuarioId: usuarios[1]._id,
        libroId: libros[1]._id,
        fechaPrestamo: new Date("2026-02-15"),
        fechaVencimiento: new Date("2026-02-25"),
        estado: "Activo",
        multa: 0
      },
      {
        _id: new ObjectId(),
        usuarioId: usuarios[2]._id,
        libroId: libros[2]._id,
        fechaPrestamo: new Date("2026-01-20"),
        fechaVencimiento: new Date("2026-01-30"),
        estado: "Atrasado",
        multa: 3.5
      },
      {
        _id: new ObjectId(),
        usuarioId: usuarios[3]._id,
        libroId: libros[3]._id,
        fechaPrestamo: new Date("2026-02-01"),
        fechaVencimiento: new Date("2026-02-11"),
        estado: "Devuelto",
        multa: 0
      }
    ];

    await db.collection("autores").insertMany(autores);
    await db.collection("categorias").insertMany(categorias);
    await db.collection("usuarios").insertMany(usuarios);
    await db.collection("libros").insertMany(libros);
    await db.collection("prestamos").insertMany(prestamos);
  }
};
