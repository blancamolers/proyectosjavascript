// ================================================
//   PIEZAS QUE SE REPITEN EN TODAS LAS PÁGINAS
// ================================================
// El menú de arriba, el pie, el carrito y la ventana de reservar
// están escritos aquí UNA sola vez. Cada página HTML tiene dos huecos:
//
//   <div id="cabecera"></div>        → aquí va el menú de arriba
//   <div id="piezasComunes"></div>   → aquí va el pie, el carrito, etc.
//
// y este archivo los rellena. Si cambias algo aquí, cambia en todas las páginas.

// ¿En qué página estamos? Lo dice el <body data-pagina="...">
const paginaActual = document.body.dataset.pagina;

// Crea un enlace del menú y lo marca si es la página actual
function enlace(pagina, archivo, texto) {
  const activo = pagina === paginaActual ? " active" : "";
  return `<li class="nav-item"><a class="nav-link${activo}" href="${archivo}">${texto}</a></li>`;
}


// ---------- MENÚ DE NAVEGACIÓN ----------
document.getElementById("cabecera").innerHTML = `
  <nav class="navbar navbar-expand-lg sticky-top navbar-cafe">
    <div class="container">
      <a class="navbar-brand" href="index.html">
        <span class="logo">Dalbit Café</span>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuPrincipal">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          ${enlace("inicio", "index.html", "Inicio")}
          ${enlace("menu", "menu.html", "Menú")}
          ${enlace("informacion", "informacion.html", "Información")}
          <li class="nav-item">
            <button class="btn btn-rosa ms-lg-2" data-bs-toggle="modal" data-bs-target="#modalReserva">
              Reservar mesa
            </button>
          </li>
          <li class="nav-item">
            <!-- Botón del carrito: abre el panel lateral -->
            <button class="btn btn-borde position-relative ms-lg-1 mt-2 mt-lg-0" data-bs-toggle="offcanvas" data-bs-target="#panelCarrito">
              🛒 Mi pedido
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill contador numero-carrito">0</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>`;


// ---------- PIE, RESERVA, CARRITO Y AVISOS ----------
document.getElementById("piezasComunes").innerHTML = `
  <!-- Pie de página -->
  <footer class="pie text-center py-4">
    <p class="logo mb-1">Dalbit Café</p>
    <p class="mb-0 small">Calle de las Flores 24 · 2026</p>
  </footer>

  <!-- Ventana: reservar mesa -->
  <div class="modal fade" id="modalReserva" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Reservar mesa 🌸</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <form id="formReserva">
          <div class="modal-body">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text" class="form-control" id="nombre" required>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-6">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fecha" required>
              </div>
              <div class="col-6">
                <label for="hora" class="form-label">Hora</label>
                <input type="time" class="form-control" id="hora" required>
              </div>
            </div>
            <div class="mb-3">
              <label for="personas" class="form-label">Personas</label>
              <select class="form-select" id="personas">
                <option>1</option>
                <option selected>2</option>
                <option>3</option>
                <option>4</option>
                <option>5 o más</option>
              </select>
            </div>

            <!-- Mensaje de confirmación (oculto al inicio) -->
            <div id="mensajeOk" class="alert alert-success d-none mb-0">
              ¡Listo! Tu mesa quedó reservada. ¡Gracias! 💗
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-borde" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-rosa">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Panel lateral: carrito -->
  <div class="offcanvas offcanvas-end panel-carrito" tabindex="-1" id="panelCarrito">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">🛒 Mi pedido</h5>
      <button id="btnVaciar" class="btn btn-sm btn-borde ms-auto me-2">🗑️ Vaciar</button>
      <button type="button" class="btn-close m-0" data-bs-dismiss="offcanvas"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column">
      <!-- Aquí JavaScript pinta los productos -->
      <ul id="listaCarrito" class="list-unstyled flex-grow-1"></ul>

      <!-- Mensaje cuando no hay nada -->
      <p id="carritoVacio" class="text-center texto-suave my-auto">
        Tu pedido está vacío 🥺<br>Agrega algo rico del <a href="menu.html">menú</a>.
      </p>

      <div class="border-top pt-3">
        <!-- Barra: cuánto falta para el envío gratis -->
        <small id="textoEnvio" class="d-block texto-suave mb-1"></small>
        <div class="progress mb-3" style="height: 8px;">
          <div id="barraEnvio" class="progress-bar barra-envio" style="width: 0%;"></div>
        </div>

        <div class="d-flex justify-content-between mb-3">
          <span class="fs-5">Subtotal</span>
          <span id="total" class="precio">0,00 €</span>
        </div>
        <a id="btnFormalizar" href="pedido.html" class="btn btn-rosa w-100">Formalizar pedido</a>
      </div>
    </div>
  </div>

  <!-- Carrito flotante (solo en celular, donde el menú de arriba está escondido) -->
  <button class="btn btn-rosa carrito-flotante d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#panelCarrito">
    🛒 <span class="numero-carrito">0</span>
  </button>

  <!-- Botón para volver arriba -->
  <a href="#" id="btnArriba" class="btn btn-arriba">↑</a>

  <!-- Aviso pequeño (Toast de Bootstrap) -->
  <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
    <div id="aviso" class="toast aviso" role="alert">
      <div class="toast-body" id="textoAviso">Agregado</div>
    </div>
  </div>`;
