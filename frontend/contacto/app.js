const API_URL = "http://localhost:3000";


const listaMensajes = document.getElementById("listaMensajes");
const mensajeId = document.getElementById("mensajeId");
const nombreInput = document.getElementById("nombre");
const correoInput = document.getElementById("correo");
const asuntoInput = document.getElementById("asunto")
const mensajeInput = document.getElementById("mensaje");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const formulario = document.getElementById("formulario-Mensajes");
const tituloFormulario = document.getElementById("tituloFormulario");


// 1. Funcion de consultar los productos y mostrarlos enel DOM (READ)

async function cargarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/contactos`);
    const mensajes = await respuesta.json();

    listaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
      listaMensajes.innerHTML = "<p style='color: #64748b;'>No hay Mensajes registrados.</p>";
      return;
    }

    mensajes.forEach((mensaje) => {
      const elemento = document.createElement("div");
      elemento.classList.add("mensajes");


        
      elemento.innerHTML = `
        <div>
          <h3>${mensaje.asunto}</h3>
          <p>De: ${mensaje.nombre} - ${mensaje.correo}</p>
          <p>Mensaje: ${mensaje.mensaje}</p>
        </div><br>
        <br>
        <div class="acciones">
        <button class="btn-editar" onclick="cargarEnFormulario(${mensaje.id}, '${mensaje.nombre}', '${mensaje.correo}', '${mensaje.asunto}', '${mensaje.mensaje}')">Editar</button>
        <button class="btn-eliminar" onclick="eliminarMensaje(${mensaje.id})">Eliminar</button>
        </div><br>
        <hr>
      `;

      listaMensajes.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}







// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, correo, asunto, mensaje) {
    mensajeId.value = id;
    nombreInput.value = nombre;
    correoInput.value = correo;
    asuntoInput.value = asunto;
    mensajeInput.value = mensaje;

    tituloFormulario.textContent = "Editar Mensaje";
    btnGuardar.textContent = "Actualizar Mensaje";
    btnCancelar.style.display = "block";
    nombreInput.focus();
}


// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  formulario.reset();
  mensajeId.value = "";
  tituloFormulario.textContent = "Registrar Mensaje";
  btnGuardar.textContent = "Guardar Mensaje";
  btnCancelar.style.display = "none";
}

if (btnCancelar) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}



// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = mensajeId.value;
    const nombre = nombreInput.value;
    const correo = correoInput.value;
    const asunto = asuntoInput.value;
    const mensaje = mensajeInput.value;

    try {
      const respuesta = await fetch(
        id ? `${API_URL}/contactos/${id}` : `${API_URL}/contactos`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, asunto, mensaje }),
        }
      );

      if (!respuesta.ok) {
        throw new Error(`Error al guardar el mensaje: ${respuesta.status}`);
      }

      cancelarEdicion();
      await cargarMensajes();
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
      alert("No se pudo guardar el mensaje. Revisa el servidor.");
    }
  });
}



// 4. Eliminar un producto (DELETE)
async function eliminarMensaje(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/contactos/${id}`, {
      method: "DELETE",
    });

    // Si estábamos editando ese mismo producto, cancelamos la edición
    if (mensajeId.value == id) {
      cancelarEdicion();
    }

    cargarMensajes(); // Refrescar la lista en pantalla
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}




cargarMensajes();