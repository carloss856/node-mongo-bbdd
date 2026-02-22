const collectionSelect = document.getElementById("collectionSelect");
const btnList = document.getElementById("btnList");
const btnNew = document.getElementById("btnNew");
const formTitle = document.getElementById("formTitle");
const entityForm = document.getElementById("entityForm");
const formFields = document.getElementById("formFields");
const btnCancelEdit = document.getElementById("btnCancelEdit");
const btnCloseModal = document.getElementById("btnCloseModal");
const formModal = document.getElementById("formModal");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const resultHead = document.getElementById("resultHead");
const resultBody = document.getElementById("resultBody");
const output = document.getElementById("output");
const stockSection = document.getElementById("stockSection");
const maxStock = document.getElementById("maxStock");

const schemas = {
  autores: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "pais", label: "Pais", type: "text", required: true },
    { name: "anioNacimiento", label: "Anio Nacimiento", type: "number", required: true },
    { name: "generoLiterario", label: "Genero Literario", type: "text", required: true },
    { name: "activo", label: "Activo", type: "boolean", required: true }
  ],
  categorias: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "descripcion", label: "Descripcion", type: "text", required: true },
    { name: "nivel", label: "Nivel", type: "enum", required: true, options: ["Basico", "Intermedio", "Avanzado"] },
    { name: "activa", label: "Activa", type: "boolean", required: true }
  ],
  usuarios: [
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "rol", label: "Rol", type: "enum", required: true, options: ["Estudiante", "Docente", "Administrador"] },
    { name: "activo", label: "Activo", type: "boolean", required: true }
  ],
  libros: [
    { name: "titulo", label: "Titulo", type: "text", required: true },
    { name: "isbn", label: "ISBN", type: "text", required: true },
    { name: "anioPublicacion", label: "Anio Publicacion", type: "number", required: true },
    { name: "stock", label: "Stock", type: "number", required: true },
    { name: "precio", label: "Precio", type: "number", step: "0.01", required: true },
    { name: "autorId", label: "Autor ID", type: "text", required: true },
    { name: "categoriaId", label: "Categoria ID", type: "text", required: true }
  ],
  prestamos: [
    {
      name: "usuarioId",
      label: "Usuario",
      type: "relation",
      required: true,
      source: "usuarios",
      labelField: "nombre"
    },
    {
      name: "libroId",
      label: "Libro",
      type: "relation",
      required: true,
      source: "libros",
      labelField: "titulo"
    },
    { name: "fechaPrestamo", label: "Fecha Prestamo", type: "date", required: true },
    { name: "fechaVencimiento", label: "Fecha Vencimiento", type: "date", required: true },
    { name: "estado", label: "Estado", type: "enum", required: true, options: ["Activo", "Devuelto", "Atrasado"] },
    { name: "multa", label: "Multa", type: "number", step: "0.01", required: true }
  ]
};

let allRows = [];
let filteredRows = [];
let editingId = null;

const getCollection = () => collectionSelect.value;
const apiPath = (suffix = "") => `/api/${getCollection()}${suffix}`;

const getObjectIdDate = (id) => {
  if (!id || typeof id !== "string" || id.length < 8) return 0;
  const seconds = Number.parseInt(id.substring(0, 8), 16);
  return Number.isNaN(seconds) ? 0 : seconds * 1000;
};

const show = (data) => {
  output.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
};

const request = async (url, options = {}) => {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body.message || "Error en la solicitud");
  }

  return body;
};

const fetchRelationOptions = async (source) => {
  return request(`/api/${source}`);
};

const createInput = async (field) => {
  if (field.type === "enum") {
    const select = document.createElement("select");
    field.options.forEach((optionValue) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      select.appendChild(option);
    });
    select.name = field.name;
    select.required = Boolean(field.required);
    return select;
  }

  if (field.type === "boolean") {
    const select = document.createElement("select");
    [
      { value: "true", label: "true" },
      { value: "false", label: "false" }
    ].forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });
    select.name = field.name;
    select.required = Boolean(field.required);
    return select;
  }

  if (field.type === "relation") {
    const select = document.createElement("select");
    select.name = field.name;
    select.required = Boolean(field.required);

    const options = await fetchRelationOptions(field.source);
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = item._id;
      option.textContent = `${item[field.labelField] || item._id}`;
      select.appendChild(option);
    });

    return select;
  }

  const input = document.createElement("input");
  input.type = field.type;
  input.name = field.name;
  input.required = Boolean(field.required);
  if (field.step) input.step = field.step;
  return input;
};

const renderForm = async () => {
  formFields.innerHTML = "";
  const schema = schemas[getCollection()];

  for (const field of schema) {
    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const label = document.createElement("label");
    label.textContent = field.label;
    label.htmlFor = `field-${field.name}`;

    const input = await createInput(field);
    input.id = `field-${field.name}`;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    formFields.appendChild(wrapper);
  }
};

const openModal = () => {
  formModal.classList.remove("hidden");
};

const closeModal = () => {
  formModal.classList.add("hidden");
};

const resetForm = () => {
  editingId = null;
  formTitle.textContent = "Crear registro";
  document.getElementById("btnSubmitForm").textContent = "Guardar";
  entityForm.reset();
};

const fillForm = (item) => {
  const schema = schemas[getCollection()];
  schema.forEach((field) => {
    const input = entityForm.elements[field.name];
    if (!input) return;

    let value = item[field.name];

    if (field.name.endsWith("Id") && value && typeof value === "object" && value._id) {
      value = value._id;
    }

    if (field.type === "date" && value) {
      const d = new Date(value);
      value = d.toISOString().slice(0, 10);
    }

    if (field.type === "boolean") {
      input.value = String(Boolean(value));
      return;
    }

    input.value = value ?? "";
  });
};

const normalizeValue = (field, rawValue) => {
  if (field.type === "number") return rawValue === "" ? null : Number(rawValue);
  if (field.type === "boolean") return rawValue === "true";
  if (field.type === "date") return rawValue ? new Date(rawValue).toISOString() : null;
  return rawValue;
};

const readFormData = () => {
  const schema = schemas[getCollection()];
  const payload = {};

  schema.forEach((field) => {
    const rawValue = entityForm.elements[field.name].value;
    payload[field.name] = normalizeValue(field, rawValue);
  });

  return payload;
};

const formatValue = (value) => {
  if (value === null || value === undefined) return "-";
  if (typeof value === "object") {
    if (value.nombre) return value.nombre;
    if (value.titulo) return value.titulo;
    if (value._id) return value._id;
    return JSON.stringify(value);
  }
  return String(value);
};

const getCellValue = (row, fieldName) => {
  const value = row[fieldName];
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if (value.nombre) return value.nombre;
    if (value.titulo) return value.titulo;
    if (value._id) return value._id;
  }
  return value;
};

const applySort = () => {
  const mode = sortSelect.value || "recent_desc";
  const list = [...filteredRows];

  if (mode === "recent_desc") {
    list.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime() || getObjectIdDate(a._id);
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime() || getObjectIdDate(b._id);
      return bTime - aTime;
    });
    return list;
  }

  if (mode.startsWith("field:")) {
    const fieldName = mode.replace("field:", "");
    list.sort((a, b) => String(getCellValue(a, fieldName)).localeCompare(String(getCellValue(b, fieldName))));
    return list;
  }

  return list;
};

const buildSortOptions = () => {
  const schema = schemas[getCollection()];
  sortSelect.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "recent_desc";
  defaultOption.textContent = "Orden: mas reciente";
  sortSelect.appendChild(defaultOption);

  schema.forEach((field) => {
    const option = document.createElement("option");
    option.value = `field:${field.name}`;
    option.textContent = `Ordenar por ${field.label}`;
    sortSelect.appendChild(option);
  });
};

const renderTable = () => {
  const schema = schemas[getCollection()];
  const headers = [...schema.map((f) => f.label), "Acciones"];

  resultHead.innerHTML = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;

  if (!filteredRows.length) {
    resultBody.innerHTML = '<tr><td colspan="99">Sin resultados</td></tr>';
    return;
  }

  const orderedRows = applySort();

  resultBody.innerHTML = orderedRows
    .map((row) => {
      const cells = [
        ...schema.map((field) => `<td>${formatValue(row[field.name])}</td>`),
        `<td class="actions">
          <button class="small" data-action="edit" data-id="${row._id}">Editar</button>
          <button class="small danger" data-action="delete" data-id="${row._id}">Eliminar</button>
        </td>`
      ];
      return `<tr>${cells.join("")}</tr>`;
    })
    .join("");
};

const applySearch = () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    filteredRows = [...allRows];
    renderTable();
    return;
  }

  const schema = schemas[getCollection()];

  filteredRows = allRows.filter((row) => {
    const haystack = [row._id, ...schema.map((f) => formatValue(row[f.name]))].join(" ").toLowerCase();
    return haystack.includes(q);
  });

  renderTable();
};

const loadCollection = async () => {
  try {
    allRows = await request(apiPath());
    filteredRows = [...allRows];
    renderTable();
    show({ coleccion: getCollection(), total: allRows.length });
  } catch (error) {
    show(error.message);
  }
};

const openCreateModal = async () => {
  editingId = null;
  await renderForm();
  resetForm();
  openModal();
};

const startEdit = async (id) => {
  const item = allRows.find((row) => row._id === id);
  if (!item) return;

  editingId = id;
  await renderForm();
  formTitle.textContent = `Editar registro (${id})`;
  document.getElementById("btnSubmitForm").textContent = "Actualizar";
  fillForm(item);
  openModal();
};

const removeRow = async (id) => {
  const ok = window.confirm("Confirma eliminar este registro?");
  if (!ok) return;

  try {
    const data = await request(apiPath(`/${id}`), { method: "DELETE" });
    show(data);
    await loadCollection();
  } catch (error) {
    show(error.message);
  }
};

entityForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = readFormData();

  try {
    const data = editingId
      ? await request(apiPath(`/${editingId}`), { method: "PUT", body: JSON.stringify(payload) })
      : await request(apiPath(), { method: "POST", body: JSON.stringify(payload) });

    show(data);
    closeModal();
    resetForm();
    await loadCollection();
  } catch (error) {
    show(error.message);
  }
});

resultBody.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) return;

  if (action === "edit") await startEdit(id);
  if (action === "delete") await removeRow(id);
});

btnCancelEdit.addEventListener("click", () => {
  resetForm();
  closeModal();
});

btnCloseModal.addEventListener("click", () => {
  resetForm();
  closeModal();
});

formModal.addEventListener("click", (event) => {
  if (event.target === formModal) {
    resetForm();
    closeModal();
  }
});

btnList.addEventListener("click", loadCollection);
btnNew.addEventListener("click", openCreateModal);
searchInput.addEventListener("input", applySearch);
sortSelect.addEventListener("change", renderTable);

collectionSelect.addEventListener("change", async () => {
  searchInput.value = "";
  buildSortOptions();
  sortSelect.value = "recent_desc";
  closeModal();
  stockSection.style.display = getCollection() === "libros" ? "block" : "none";
  await loadCollection();
});

document.getElementById("btnStock").addEventListener("click", async () => {
  try {
    const data = await request(`/api/libros/consulta/stock-bajo?maxStock=${Number(maxStock.value || 2)}`);
    show(data);
  } catch (error) {
    show(error.message);
  }
});

const boot = async () => {
  buildSortOptions();
  sortSelect.value = "recent_desc";
  stockSection.style.display = getCollection() === "libros" ? "block" : "none";
  closeModal();
  await loadCollection();
};

boot();
