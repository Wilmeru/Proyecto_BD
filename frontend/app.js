const API_URL = "http://localhost:3000";

// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");

// 1. Consultar y mostrar productos (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);

    if (!respuesta.ok) {
      throw new Error("Error al consultar los productos");
    }

    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML =
        "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      const informacion = document.createElement("div");

      const titulo = document.createElement("h3");
      titulo.textContent = producto.nombre;

      const precio = document.createElement("p");
      precio.classList.add("producto-precio");
      precio.textContent = `Precio: $${producto.precio}`;

      const stock = document.createElement("p");
      stock.textContent = `Stock: ${producto.stok} unidades`;

      informacion.append(titulo, precio, stock);

      const acciones = document.createElement("div");
      acciones.classList.add("acciones");

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn-editar");
      btnEditar.textContent = "Editar";

      btnEditar.addEventListener("click", () => {
        cargarEnFormulario(
          producto.id,
          producto.nombre,
          producto.precio,
          producto.stok
        );
      });

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn-eliminar");
      btnEliminar.textContent = "Eliminar";

      btnEliminar.addEventListener("click", () => {
        eliminarProducto(producto.id);
      });

      acciones.append(btnEditar, btnEliminar);
      elemento.append(informacion, acciones);
      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
    listaProductos.innerHTML =
      "<p>No se pudieron cargar los productos.</p>";
  }
}

// 2. Cargar producto en el formulario (UPDATE)
function cargarEnFormulario(id, nombre, precio, stok) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stok;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";

  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  if (!formulario) return;

  formulario.reset();
  productoId.value = "";

  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Registrar o actualizar producto (CREATE / UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = productoId.value;
    const nombre = nombreInput.value.trim();
    const precio = Number(precioInput.value);
    const stok = Number(stockInput.value);

    if (
      !nombre ||
      precioInput.value === "" ||
      stockInput.value === "" ||
      !Number.isFinite(precio) ||
      !Number.isFinite(stok) ||
      precio < 0 ||
      stok < 0
    ) {
      alert("Ingresa un nombre, precio y stock válidos.");
      return;
    }

    try {
      const url = id
        ? `${API_URL}/productos/${id}`
        : `${API_URL}/productos`;

      const metodo = id ? "PUT" : "POST";

      const respuesta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio,
          stok,
        }),
      });

      if (!respuesta.ok) {
        throw new Error(
          `Error al guardar el producto: ${respuesta.status}`
        );
      }

      cancelarEdicion();
      await cargarProductos();

      alert(
        id
          ? "Producto actualizado correctamente."
          : "Producto registrado correctamente."
      );
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("No se pudo guardar el producto. Verifica el servidor.");
    }
  });
}

// 4. Eliminar producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm(
    "¿Deseas eliminar este producto de la base de datos?"
  );

  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error("Error al eliminar el producto");
    }

    if (productoId.value == id) {
      cancelarEdicion();
    }

    await cargarProductos();
    alert("Producto eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    alert("No se pudo eliminar el producto.");
  }
}

// 5. Formulario de contacto
if (formContacto) {
  formContacto.addEventListener("submit", (event) => {
    event.preventDefault();

    alert("¡Mensaje de contacto enviado con éxito!");
    formContacto.reset();
  });
}

// 6. Cargar productos al iniciar
cargarProductos();