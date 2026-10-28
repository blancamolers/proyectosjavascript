// ================================================
//   CÓDIGO QUE USAN TODAS LAS PÁGINAS
// ================================================
// Funciones de ayuda, datos del negocio, horario, reservas, animaciones y carrito.
// Va después de datos.js y plantilla.js, porque usa sus datos y su HTML.


// ---------- FUNCIONES DE AYUDA ----------

// Muestra (true) u oculta (false) un elemento
function mostrar(elemento, siONo) {
  elemento.classList.toggle("d-none", !siONo);
}

// Cambia el texto de un elemento usando su id
function ponerTexto(id, texto) {
  document.getElementById(id).textContent = texto;
}

// Lee lo que se escribió en un campo usando su id
function valor(id) {
  return document.getElementById(id).value.trim();
}

// Convierte 4.5 en "4,50 €"
function formatoPrecio(numero) {
  return numero.toFixed(2).replace(".", ",") + " €";
}

// Pone un 0 delante si hace falta: 7 → "07"
function dosCifras(numero) {
  return String(numero).padStart(2, "0");
}

// La hora de ahora como texto: "18:05"
function horaAhora() {
  const ahora = new Date();
  return dosCifras(ahora.getHours()) + ":" + dosCifras(ahora.getMinutes());
}

// Una fecha como la quieren los <input type="date">: "2026-10-28"
function fechaParaInput(fecha) {
  return fecha.getFullYear() + "-" + dosCifras(fecha.getMonth() + 1) + "-" + dosCifras(fecha.getDate());
}

// Enlace de WhatsApp con el mensaje ya escrito
function enlaceWhatsApp(mensaje) {
  return "https://wa.me/" + NEGOCIO.whatsapp + "?text=" + encodeURIComponent(mensaje);
}

// Muestra el aviso pequeño de arriba
const aviso = new bootstrap.Toast(document.getElementById("aviso"), { delay: 2000 });

function mostrarAviso(texto) {
  ponerTexto("textoAviso", texto);
  aviso.show();
}


// ---------- DATOS DEL NEGOCIO EN LA PÁGINA ----------
// <span data-dato="telefono"></span>  → escribe el teléfono de datos.js
// <a data-enlace="whatsapp">          → pone el enlace correcto

const ENLACES = {
  telefono: "tel:" + NEGOCIO.telefono.replaceAll(" ", ""),
  whatsapp: "https://wa.me/" + NEGOCIO.whatsapp,
  email: "mailto:" + NEGOCIO.email,
  mapa: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(NEGOCIO.direccion),
  instagram: NEGOCIO.instagram,
  tiktok: NEGOCIO.tiktok
};

document.querySelectorAll("[data-dato]").forEach(function (elemento) {
  let dato = NEGOCIO[elemento.dataset.dato];
  if (typeof dato === "number") {
    dato = formatoPrecio(dato).replace(",00", ""); // los números de datos.js son precios: 20 → "20 €"
  }
  elemento.textContent = dato;
});

document.querySelectorAll("[data-enlace]").forEach(function (enlace) {
  enlace.href = ENLACES[enlace.dataset.enlace];
});

ponerTexto("anio", new Date().getFullYear());


// ---------- HORARIO ----------

// Orden de la semana empezando en lunes (JavaScript empieza en domingo = 0)
const SEMANA = [1, 2, 3, 4, 5, 6, 0];

// Horario de un día: horarioDe(new Date()) → { dia: "Lunes", abre: "09:00", cierra: "21:00" }
function horarioDe(fecha) {
  return NEGOCIO.horario[fecha.getDay()];
}

// ¿Está abierto ahora? Devuelve el texto para el aviso
function estadoDelLocal() {
  const hoy = horarioDe(new Date());
  const hora = horaAhora();

  if (hora >= hoy.abre && hora < hoy.cierra) {
    return "🟢 Abierto · hasta las " + hoy.cierra;
  }
  if (hora < hoy.abre) {
    return "🔴 Cerrado · abrimos a las " + hoy.abre;
  }
  const manana = NEGOCIO.horario[(new Date().getDay() + 1) % 7];
  return "🔴 Cerrado · mañana a las " + manana.abre;
}

document.querySelectorAll(".estado-local").forEach(function (elemento) {
  elemento.textContent = estadoDelLocal();
});

// Junta los días seguidos con el mismo horario: "Lunes a viernes: 09:00 – 21:00"
function horarioAgrupado() {
  const grupos = [];

  SEMANA.forEach(function (numero) {
    const dia = NEGOCIO.horario[numero];
    const horas = dia.abre + " – " + dia.cierra;
    const ultimo = grupos[grupos.length - 1];

    if (ultimo && ultimo.horas === horas) {
      ultimo.hasta = dia.dia;   // mismo horario que el día anterior: lo alargamos
    } else {
      grupos.push({ desde: dia.dia, hasta: dia.dia, horas: horas });
    }
  });

  return grupos.map(function (g) {
    const dias = g.desde === g.hasta ? g.desde : g.desde + " a " + g.hasta.toLowerCase();
    return { dias: dias, horas: g.horas };
  });
}

// Horario en el pie de página
horarioAgrupado().forEach(function (grupo) {
  document.getElementById("pieHorario").innerHTML += `<li class="mb-1"><strong>${grupo.dias}:</strong> ${grupo.horas}</li>`;
});

// Pone a un <input type="time"> las horas permitidas de un día
function limitarHora(campoHora, fecha, desdeAhora) {
  const horario = horarioDe(fecha);
  let desde = horario.abre;
  if (desdeAhora && horaAhora() > desde) {
    desde = horaAhora();   // si es para hoy, no se puede elegir una hora que ya pasó
  }
  campoHora.min = desde;
  campoHora.max = horario.cierra;
  return "Puedes elegir de " + desde + " a " + horario.cierra + ".";
}


// ---------- RESERVAR MESA (se envía por WhatsApp) ----------

const formReserva = document.getElementById("formReserva");
const campoFecha = document.getElementById("fecha");
const campoHora = document.getElementById("hora");

// No se puede reservar para un día que ya pasó, ni a más de 30 días
const hoy = new Date();
const dentroDe30 = new Date();
dentroDe30.setDate(hoy.getDate() + 30);
campoFecha.min = fechaParaInput(hoy);
campoFecha.max = fechaParaInput(dentroDe30);

// Al elegir el día, ajustamos las horas a su horario
campoFecha.addEventListener("change", function () {
  if (campoFecha.value === "") {
    return;
  }
  const fecha = new Date(campoFecha.value + "T00:00");
  const esHoy = campoFecha.value === fechaParaInput(new Date());
  ponerTexto("ayudaReserva", limitarHora(campoHora, fecha, esHoy));
});

formReserva.addEventListener("submit", function (evento) {
  evento.preventDefault();   // evita que la página se recargue

  // Validación de Bootstrap: si falta algo, se pinta en rojo y paramos
  if (!formReserva.checkValidity()) {
    formReserva.classList.add("was-validated");
    formReserva.querySelector(":invalid").focus();
    return;
  }

  const fecha = campoFecha.value.split("-").reverse().join("/"); // 2026-10-28 → 28/10/2026
  const mensaje =
    "Hola, quiero reservar una mesa en " + NEGOCIO.nombre + " 🌸\n" +
    "👤 " + valor("nombre") + "\n" +
    "📞 " + valor("telefono") + "\n" +
    "📅 " + fecha + " a las " + valor("hora") + "\n" +
    "👥 " + valor("personas") + " personas";

  document.getElementById("btnReservaWhatsApp").href = enlaceWhatsApp(mensaje);
  mostrar(document.getElementById("reservaCampos"), false);
  mostrar(document.getElementById("reservaBotones"), false);
  mostrar(document.getElementById("reservaLista"), true);
});

// Cuando se cierra la ventana, la dejamos limpia para la próxima vez
document.getElementById("modalReserva").addEventListener("hidden.bs.modal", function () {
  formReserva.reset();
  formReserva.classList.remove("was-validated");
  ponerTexto("ayudaReserva", "");
  mostrar(document.getElementById("reservaCampos"), true);
  mostrar(document.getElementById("reservaBotones"), true);
  mostrar(document.getElementById("reservaLista"), false);
});


// ---------- ANIMACIÓN AL HACER SCROLL ----------

// Cuando un elemento con la clase "aparecer" entra en la pantalla, le ponemos "visible"
const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
    }
  });
});

// La llamamos aquí y otra vez en cada página que crea tarjetas nuevas
function activarAnimaciones() {
  document.querySelectorAll(".aparecer").forEach(function (elemento) {
    observador.observe(elemento);
  });
}

// Botón "volver arriba": aparece cuando bajas más de 400px
const btnArriba = document.getElementById("btnArriba");

window.addEventListener("scroll", function () {
  btnArriba.classList.toggle("mostrar", window.scrollY > 400);
});


// ---------- TARJETA DE PRODUCTO (portada y menú) ----------

function htmlTarjeta(producto, indice) {
  const insignia = producto.insignia ? `<span class="badge rounded-pill text-bg-dark position-absolute top-0 end-0 m-2">${producto.insignia}</span>` : "";

  return `
    <div class="col aparecer">
      <div class="card h-100 border-0 rounded-4 shadow-sm overflow-hidden levantar">
        ${insignia}
        <img src="img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}" width="300" height="220" loading="lazy">
        <div class="card-body">
          <h3 class="card-title h5">${producto.nombre}</h3>
          <p class="card-text text-body-secondary">${producto.descripcion}</p>
        </div>
        <div class="card-footer bg-transparent border-0 pt-0 pb-3 d-flex justify-content-between align-items-center">
          <span class="precio fs-5 text-primary">${formatoPrecio(producto.precio)}</span>
          <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="anadir(this, ${indice})" aria-label="Añadir ${producto.nombre} al pedido">+ Añadir</button>
        </div>
      </div>
    </div>`;
}

// Botón "+ Añadir" de cada tarjeta
function anadir(boton, indice) {
  anadirAlCarrito(productos[indice].nombre, productos[indice].precio);

  // El botón dice "✓ Añadido" un momento
  boton.textContent = "✓ Añadido";
  boton.disabled = true;
  setTimeout(function () {
    boton.textContent = "+ Añadir";
    boton.disabled = false;
  }, 800);
}


// ================================================
//                 CARRITO DE PEDIDO
// ================================================

// Aquí guardamos lo que el cliente va pidiendo.
// Cada producto es así: { nombre: "Croffle", precio: 5, cantidad: 2 }
// Se guarda en el navegador (localStorage), así se comparte entre páginas.
let carrito = [];

try {
  carrito = JSON.parse(localStorage.getItem("carritoDalbit")) || [];
} catch (error) {
  carrito = [];
}

function guardarCarrito() {
  try {
    localStorage.setItem("carritoDalbit", JSON.stringify(carrito));
  } catch (error) {
    // si el navegador no deja guardar, no pasa nada
  }
}

function calcularSubtotal() {
  let suma = 0;
  carrito.forEach(function (producto) {
    suma = suma + producto.precio * producto.cantidad;
  });
  return suma;
}

// Añade un producto (o suma 1 si ya estaba)
function anadirAlCarrito(nombre, precio) {
  const existe = carrito.find(function (p) { return p.nombre === nombre; });
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
  }

  mostrarCarrito();
  mostrarAviso("✅ " + nombre + " añadido a tu pedido");

  // Animación del contador de arriba
  const contador = document.querySelector(".contador");
  contador.classList.remove("saltar");
  void contador.offsetWidth; // truco para que la animación se repita
  contador.classList.add("saltar");
}

// Botones + y − de cada producto
function cambiarCantidad(indice, cambio) {
  carrito[indice].cantidad = carrito[indice].cantidad + cambio;

  // Si llega a 0, lo quitamos del carrito
  if (carrito[indice].cantidad === 0) {
    carrito.splice(indice, 1);
  }
  mostrarCarrito();
}

// HTML de un producto del carrito (lo usan el panel lateral y pedido.html)
function htmlProducto(producto, indice) {
  return `
    <li class="bg-white rounded-3 px-3 py-2 mb-2 d-flex justify-content-between align-items-center">
      <div>
        <div class="fw-bold">${producto.nombre}</div>
        <small class="text-body-secondary">${formatoPrecio(producto.precio)} c/u</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-sm btn-outline-primary rounded-circle btn-cantidad" onclick="cambiarCantidad(${indice}, -1)" aria-label="Quitar un ${producto.nombre}">−</button>
        <span>${producto.cantidad}</span>
        <button type="button" class="btn btn-sm btn-outline-primary rounded-circle btn-cantidad" onclick="cambiarCantidad(${indice}, 1)" aria-label="Añadir otro ${producto.nombre}">+</button>
      </div>
    </li>`;
}

// Dibuja el carrito en el panel lateral
function mostrarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  let piezas = 0;

  carrito.forEach(function (producto, indice) {
    piezas = piezas + producto.cantidad;
    lista.innerHTML += htmlProducto(producto, indice);
  });

  // Todos los contadores (el de arriba y el flotante del móvil)
  document.querySelectorAll(".numero-carrito").forEach(function (c) {
    c.textContent = piezas;
  });

  const subtotal = calcularSubtotal();
  ponerTexto("total", formatoPrecio(subtotal));

  // Barra de envío gratis
  const porcentaje = Math.min(subtotal / NEGOCIO.envioGratisDesde * 100, 100);
  document.getElementById("barraEnvio").style.width = porcentaje + "%";
  if (subtotal >= NEGOCIO.envioGratisDesde) {
    ponerTexto("textoEnvio", "🎉 ¡Tienes envío a domicilio gratis!");
  } else {
    ponerTexto("textoEnvio", "🛵 Te faltan " + formatoPrecio(NEGOCIO.envioGratisDesde - subtotal) + " para el envío gratis");
  }

  // Si está vacío mostramos el mensaje y desactivamos el botón
  const vacio = carrito.length === 0;
  mostrar(document.getElementById("carritoVacio"), vacio);
  document.getElementById("btnFormalizar").classList.toggle("disabled", vacio);

  guardarCarrito();

  // Si la página tiene su propia función para el carrito (pedido.js), la llamamos
  if (typeof alCambiarCarrito === "function") {
    alCambiarCarrito();
  }
}

// Botón "Vaciar"
document.getElementById("btnVaciar").addEventListener("click", function () {
  if (carrito.length > 0 && confirm("¿Quieres vaciar todo tu pedido?")) {
    carrito = [];
    mostrarCarrito();
  }
});


// ---------- AL CARGAR LA PÁGINA ----------
activarAnimaciones();
mostrarCarrito();
