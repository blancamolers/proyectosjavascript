// ================================================
//   CÓDIGO QUE USAN TODAS LAS PÁGINAS
// ================================================
// Funciones de ayuda, reservar mesa, animaciones y el carrito.
// Va después de plantilla.js, porque necesita que ya exista el HTML común.


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
  return document.getElementById(id).value;
}

// Convierte 4.5 en "4,50 €"
function formatoPrecio(numero) {
  return numero.toFixed(2).replace(".", ",") + " €";
}

// Muestra el aviso pequeño de arriba
const aviso = new bootstrap.Toast(document.getElementById("aviso"), { delay: 2000 });

function mostrarAviso(texto) {
  ponerTexto("textoAviso", texto);
  aviso.show();
}


// ---------- RESERVAR MESA ----------

const formReserva = document.getElementById("formReserva");
const mensajeOk = document.getElementById("mensajeOk");

formReserva.addEventListener("submit", function (evento) {
  evento.preventDefault();   // evita que la página se recargue
  mostrar(mensajeOk, true);
  formReserva.reset();       // limpia los campos
});

// Cuando se cierra la ventana, volvemos a ocultar el mensaje
document.getElementById("modalReserva").addEventListener("hidden.bs.modal", function () {
  mostrar(mensajeOk, false);
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

// La llamamos aquí y también en menu.js, después de crear las tarjetas
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


// ================================================
//                 CARRITO DE PEDIDO
// ================================================

// Reglas del envío (cámbialas si quieres)
const COSTO_ENVIO = 2.5;           // precio del envío a domicilio
const ENVIO_GRATIS_DESDE = 20;     // desde este subtotal el envío es gratis

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

// Agrega un producto (o suma 1 si ya estaba)
function agregarAlCarrito(nombre, precio) {
  const existe = carrito.find(function (p) { return p.nombre === nombre; });
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
  }

  mostrarCarrito();
  mostrarAviso("✅ " + nombre + " agregado a tu pedido");

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
    <li class="item-carrito d-flex justify-content-between align-items-center">
      <div>
        <div class="fw-bold">${producto.nombre}</div>
        <small class="texto-suave">${formatoPrecio(producto.precio)} c/u</small>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button type="button" class="btn-cantidad" onclick="cambiarCantidad(${indice}, -1)">−</button>
        <span>${producto.cantidad}</span>
        <button type="button" class="btn-cantidad" onclick="cambiarCantidad(${indice}, 1)">+</button>
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

  // Todos los contadores (el de arriba y el flotante del celular)
  document.querySelectorAll(".numero-carrito").forEach(function (c) {
    c.textContent = piezas;
  });

  const subtotal = calcularSubtotal();
  ponerTexto("total", formatoPrecio(subtotal));

  // Barra de envío gratis
  const porcentaje = Math.min(subtotal / ENVIO_GRATIS_DESDE * 100, 100);
  document.getElementById("barraEnvio").style.width = porcentaje + "%";
  if (subtotal >= ENVIO_GRATIS_DESDE) {
    ponerTexto("textoEnvio", "🎉 ¡Tienes envío a domicilio gratis!");
  } else {
    ponerTexto("textoEnvio", "🛵 Te faltan " + formatoPrecio(ENVIO_GRATIS_DESDE - subtotal) + " para envío gratis");
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
