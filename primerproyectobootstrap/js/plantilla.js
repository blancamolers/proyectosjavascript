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
//
// Los datos del negocio (teléfono, dirección...) NO se escriben aquí:
// se ponen con data-dato="..." y data-enlace="..." y comun.js los rellena con datos.js.

// ¿En qué página estamos? Lo dice el <body data-pagina="...">
const paginaActual = document.body.dataset.pagina;

// Crea un enlace del menú y lo marca si es la página actual
function enlace(pagina, archivo, texto) {
  if (pagina === paginaActual) {
    return `<li class="nav-item"><a class="nav-link active" aria-current="page" href="${archivo}">${texto}</a></li>`;
  }
  return `<li class="nav-item"><a class="nav-link" href="${archivo}">${texto}</a></li>`;
}


// ---------- MENÚ DE NAVEGACIÓN ----------
document.getElementById("cabecera").innerHTML = `
  <nav class="navbar navbar-expand-lg bg-body border-bottom navbar-cafe">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
        <span class="logo fs-3">Dalbit Café</span>
        <!-- "Abierto ahora" / "Cerrado": lo escribe comun.js según el horario -->
        <span class="badge rounded-pill bg-white text-body border fw-normal estado-local d-none d-sm-inline-block"></span>
      </a>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-label="Abrir el menú">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="menuPrincipal">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          ${enlace("inicio", "index.html", "Inicio")}
          ${enlace("menu", "menu.html", "Menú")}
          ${enlace("informacion", "informacion.html", "Información")}
          <li class="nav-item">
            <button class="btn btn-primary rounded-pill px-4 ms-lg-2" data-bs-toggle="modal" data-bs-target="#modalReserva">
              Reservar mesa
            </button>
          </li>
          <li class="nav-item">
            <!-- Botón del carrito: abre el panel lateral -->
            <button class="btn btn-outline-primary rounded-pill px-4 position-relative ms-lg-1 mt-2 mt-lg-0" data-bs-toggle="offcanvas" data-bs-target="#panelCarrito">
              🛒 Mi pedido
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-dark contador numero-carrito">0</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>`;


// ---------- PIE, RESERVA, CARRITO Y AVISOS ----------
document.getElementById("piezasComunes").innerHTML = `
  <!-- Pie de página -->
  <footer class="bg-dark text-light pt-5 pb-4">
    <div class="container">
      <div class="row g-4">
        <div class="col-12 col-md-4">
          <p class="logo fs-3 mb-2">Dalbit Café</p>
          <p class="opacity-75">Cafés, postres coreanos y croissants recién hechos. Un rincón dulce al estilo de Seúl.</p>
          <div class="d-flex gap-2">
            <a data-enlace="instagram" class="btn btn-outline-light btn-sm rounded-pill px-3" target="_blank" rel="noopener">Instagram</a>
            <a data-enlace="tiktok" class="btn btn-outline-light btn-sm rounded-pill px-3" target="_blank" rel="noopener">TikTok</a>
          </div>
        </div>

        <div class="col-6 col-md-4">
          <h5 class="mb-3">Horario</h5>
          <!-- comun.js pone aquí el horario de datos.js -->
          <ul id="pieHorario" class="list-unstyled small opacity-75 mb-0"></ul>
        </div>

        <div class="col-6 col-md-4">
          <h5 class="mb-3">Contacto</h5>
          <ul class="list-unstyled small mb-0">
            <li class="mb-2">📍 <a data-enlace="mapa" class="link-light" target="_blank" rel="noopener"><span data-dato="direccion"></span></a></li>
            <li class="mb-2">📞 <a data-enlace="telefono" class="link-light"><span data-dato="telefono"></span></a></li>
            <li class="mb-2">💬 <a data-enlace="whatsapp" class="link-light" target="_blank" rel="noopener">WhatsApp</a></li>
            <li>✉️ <a data-enlace="email" class="link-light"><span data-dato="email"></span></a></li>
          </ul>
        </div>
      </div>

      <hr class="border-light opacity-25 my-4">
      <p class="small text-center opacity-75 mb-0">© <span id="anio"></span> Dalbit Café · Hecho con 💗 y mucho café</p>
    </div>
  </footer>

  <!-- Ventana: reservar mesa -->
  <div class="modal fade" id="modalReserva" tabindex="-1" aria-labelledby="tituloReserva">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 rounded-4">
        <div class="modal-header">
          <h5 class="modal-title" id="tituloReserva">Reservar mesa 🌸</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>

        <!-- novalidate: los errores los enseña Bootstrap con sus estilos, no el navegador -->
        <form id="formReserva" novalidate>
          <!-- Paso 1: los datos -->
          <div id="reservaCampos" class="modal-body">
            <div class="row g-3">
              <div class="col-sm-6">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" id="nombre" autocomplete="name" required>
                <div class="invalid-feedback">Dinos tu nombre.</div>
              </div>
              <div class="col-sm-6">
                <label for="telefono" class="form-label">Teléfono</label>
                <input type="tel" class="form-control" id="telefono" autocomplete="tel" pattern="[0-9 +]{9,15}" required>
                <div class="invalid-feedback">Escribe un teléfono válido.</div>
              </div>
              <div class="col-6">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" class="form-control" id="fecha" required>
                <div class="invalid-feedback">Elige un día a partir de hoy.</div>
              </div>
              <div class="col-6">
                <label for="hora" class="form-label">Hora</label>
                <input type="time" class="form-control" id="hora" required>
                <div class="invalid-feedback">Elige una hora dentro del horario.</div>
              </div>
              <div class="col-12">
                <small id="ayudaReserva" class="text-body-secondary"></small>
              </div>
              <div class="col-12">
                <label for="personas" class="form-label">Personas</label>
                <select class="form-select" id="personas">
                  <option>1</option>
                  <option selected>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5 o más</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Paso 2: enviarla por WhatsApp (oculto al principio) -->
          <div id="reservaLista" class="modal-body text-center d-none">
            <div class="display-4 mb-2">📲</div>
            <h5>¡Ya casi está!</h5>
            <p class="text-body-secondary">Envíanos la reserva por WhatsApp y te la confirmamos enseguida.</p>
            <a id="btnReservaWhatsApp" class="btn btn-success rounded-pill px-4" target="_blank" rel="noopener">📲 Enviar por WhatsApp</a>
          </div>

          <div id="reservaBotones" class="modal-footer">
            <button type="button" class="btn btn-outline-primary rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" class="btn btn-primary rounded-pill px-4">Continuar</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Panel lateral: carrito -->
  <div class="offcanvas offcanvas-end" tabindex="-1" id="panelCarrito" aria-labelledby="tituloCarrito">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="tituloCarrito">🛒 Mi pedido</h5>
      <button id="btnVaciar" class="btn btn-sm btn-outline-primary rounded-pill ms-auto me-2">🗑️ Vaciar</button>
      <button type="button" class="btn-close m-0" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>

    <div class="offcanvas-body d-flex flex-column">
      <!-- Aquí JavaScript pinta los productos -->
      <ul id="listaCarrito" class="list-unstyled flex-grow-1"></ul>

      <!-- Mensaje cuando no hay nada -->
      <p id="carritoVacio" class="text-center text-body-secondary my-auto">
        Tu pedido está vacío 🥺<br>Añade algo rico del <a href="menu.html">menú</a>.
      </p>

      <div class="border-top pt-3">
        <!-- Barra: cuánto falta para el envío gratis -->
        <small id="textoEnvio" class="d-block text-body-secondary mb-1"></small>
        <div class="progress mb-3" style="height: 8px;" role="progressbar" aria-label="Progreso hacia el envío gratis">
          <div id="barraEnvio" class="progress-bar bg-primary" style="width: 0%;"></div>
        </div>

        <div class="d-flex justify-content-between mb-3">
          <span class="fs-5">Subtotal</span>
          <span id="total" class="precio fs-4 text-primary">0,00 €</span>
        </div>
        <a id="btnFormalizar" href="pedido.html" class="btn btn-primary rounded-pill px-4 w-100">Formalizar pedido</a>
      </div>
    </div>
  </div>

  <!-- Carrito flotante (solo en el móvil, donde el menú de arriba está plegado) -->
  <button class="btn btn-primary rounded-pill position-fixed bottom-0 end-0 m-3 px-4 fs-5 shadow z-3 d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#panelCarrito" aria-label="Abrir mi pedido">
    🛒 <span class="numero-carrito">0</span>
  </button>

  <!-- Botón para volver arriba -->
  <a href="#" id="btnArriba" class="btn btn-dark rounded-circle position-fixed bottom-0 start-0 m-3 shadow z-3 btn-arriba" aria-label="Volver arriba">↑</a>

  <!-- Aviso pequeño (Toast de Bootstrap) -->
  <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
    <div id="aviso" class="toast text-bg-dark border-0 rounded-4" role="status" aria-live="polite">
      <div class="toast-body" id="textoAviso">Añadido</div>
    </div>
  </div>`;
