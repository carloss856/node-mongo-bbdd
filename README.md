# Proyecto de evaluacion - Node.js + MongoDB (Biblioteca)

API REST con CRUD completo para 5 colecciones MongoDB y migraciones para crear estructura y datos iniciales.

## Colecciones incluidas

1. `autores`
2. `categorias`
3. `usuarios`
4. `libros`
5. `prestamos`

Todas tienen mas de 4 campos y el seed inicial crea 4 documentos por coleccion.

## Requisitos

- Node.js 18+
- MongoDB local o Atlas
- MongoDB Compass (para visualizacion y capturas)

## Configuracion

1. Crear archivo `.env` a partir de `.env.example`.
2. Ajustar variables:
- `MONGODB_URI` (ejemplo local: `mongodb://127.0.0.1:27017`)
- `DB_NAME` (ejemplo: `proyecto_biblioteca`)
- `PORT` (ejemplo: `3000`)

## Ejecucion

```bash
npm install
npm run migrate
npm start
```

Frontend disponible en:

- `http://localhost:3000/app`

## Endpoints CRUD

Base URL: `http://localhost:3000/api`

- `POST /autores` | `GET /autores` | `GET /autores/:id` | `PUT /autores/:id` | `DELETE /autores/:id`
- `POST /categorias` | `GET /categorias` | `GET /categorias/:id` | `PUT /categorias/:id` | `DELETE /categorias/:id`
- `POST /usuarios` | `GET /usuarios` | `GET /usuarios/:id` | `PUT /usuarios/:id` | `DELETE /usuarios/:id`
- `POST /libros` | `GET /libros` | `GET /libros/:id` | `PUT /libros/:id` | `DELETE /libros/:id`
- `POST /prestamos` | `GET /prestamos` | `GET /prestamos/:id` | `PUT /prestamos/:id` | `DELETE /prestamos/:id`

## Uso del frontend

1. Selecciona la coleccion.
2. Usa **Cargar registros** para listar documentos.
3. En **Crear documento**, edita el JSON y pulsa **Crear**.
4. En **Actualizar documento**, agrega ID + JSON y pulsa **Actualizar**.
5. Usa **Buscar por ID** y **Eliminar documento** segun necesites.
6. Con coleccion `libros`, usa la seccion de **stock bajo** para la consulta sencilla.

## Consulta sencilla (requerida)

- `GET /api/libros/consulta/stock-bajo?maxStock=2`

Devuelve libros cuyo `stock` sea menor o igual al valor enviado.

## Migraciones

- Archivo runner: `src/migrations/runMigrations.js`
- Migraciones:
  - `001-create-collections.js`
  - `002-seed-data.js`

El runner guarda control en la coleccion `migrations` para no repetir migraciones ya ejecutadas.

## Capturas para la entrega

Guardar capturas en `evidencias/` con nombres sugeridos:

- `01-conexion-compass.png`
- `02-cluster-con-colecciones.png`
- `03-coleccion-autores.png`
- `04-coleccion-categorias.png`
- `05-coleccion-usuarios.png`
- `06-coleccion-libros.png`
- `07-coleccion-prestamos.png`

## Entrega en GitHub

1. Subir este proyecto a un repositorio.
2. Incluir codigo fuente.
3. Incluir capturas organizadas dentro de `evidencias/`.
4. Compartir enlace del repositorio.
