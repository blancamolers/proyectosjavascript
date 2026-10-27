// ================================================
//   PÁGINA DE FORMALIZAR PEDIDO (pedido.html)
// ================================================

// Códigos de descuento: código → porcentaje
const CUPONES = {
  DALBIT10: 10,
  CROFFLE20: 20
};
let descuento = 0; // porcentaje del cupón aplicado

const formPedido     = document.getElementById("formPedido");
const pedidoVacio    = document.getElementById("pedidoVacio");
const pedidoListo    = document.getElementById("pedidoListo");
const campoDireccion = document.getElementById("campoDireccion");
const pedDireccion   = document.getElementById("pedDireccion");
const mensajeCupon   = document.getElementById("mensajeCupon");


// ---------- CUENTAS ----------
function esDomicilio() {
  return document.getElementById("domicilio").checked;
}

function calcularEnvio() {
  if (!esDomicilio() || calcularSubtotal() >= ENVIO_GRATIS_DESDE) {
    return 0;
  }
  return COSTO_ENVIO;
}

function calcularDescuento() {
  return calcularSubtotal() * descuento / 100;
}

function calcularTotal() {
  return calcularSubtotal() - calcularDescuento() + calcularEnvio();
}


// ---------- RESUMEN DE "TU PEDIDO" ----------
// comun.js llama a esta función cada vez que el carrito cambia
function alCambiarCarrito() {
  // Si ya se confirmó el pedido, no tocamos nada
  if (!pedidoListo.classList.contains("d-none")) {
    return;
  }

  // Si el carrito está vacío, mostramos el aviso en vez del formulario
  const vacio = carrito.length === 0;
  mostrar(pedidoVacio, vacio);
  mostrar(formPedido, !vacio);

  const lista = document.getElementById("resumenLista");
  lista.innerHTML = "";
  carrito.forEach(function (producto, indice) {
    lista.innerHTML += htmlProducto(producto, indice);
  });

  ponerTexto("resSubtotal", formatoPrecio(calcularSubtotal()));
  ponerTexto("resDescuento", "− " + formatoPrecio(calcularDescuento()));
  ponerTexto("resEnvio", calcularEnvio() === 0 ? "Gratis" : formatoPrecio(calcularEnvio()));
  ponerTexto("totalPedido", formatoPrecio(calcularTotal()));
}


// ---------- RECOGER O A DOMICILIO ----------
// La dirección solo se muestra (y es obligatoria) si es "A domicilio"
document.querySelectorAll('input[name="entrega"]').forEach(function (opcion) {
  opcion.addEventListener("change", function () {
    mostrar(campoDireccion, esDomicilio());
    pedDireccion.required = esDomicilio();
    alCambiarCarrito(); // el envío cambia el total
  });
});


// ---------- CÓDIGO DE DESCUENTO ----------
document.getElementById("btnCupon").addEventListener("click", function () {
  const codigo = valor("pedCupon").trim().toUpperCase();
  descuento = CUPONES[codigo] || 0;   // si el código no existe, queda en 0

  if (descuento > 0) {
    mensajeCupon.textContent = "🎁 ¡Cupón aplicado! " + descuento + "% de descuento";
  } else {
    mensajeCupon.textContent = "Ese código no existe 😕";
  }
  mensajeCupon.className = "d-block mb-3 " + (descuento > 0 ? "text-success" : "text-danger");
  alCambiarCarrito();
});


// ---------- CONFIRMAR EL PEDIDO ----------
formPedido.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const entrega = document.querySelector('input[name="entrega"]:checked').value;
  const notas   = valor("pedNotas");

  // Armamos el resumen
  let resumen = "<p class='mb-2'><strong>" + valor("pedNombre") + "</strong> · " + entrega + " a las " + valor("pedHora") + "</p><ul class='mb-2'>";
  carrito.forEach(function (p) {
    resumen += "<li>" + p.cantidad + " × " + p.nombre + " — " + formatoPrecio(p.precio * p.cantidad) + "</li>";
  });
  resumen += "</ul>";
  if (esDomicilio()) {
    resumen += "<p class='mb-1'>📍 " + pedDireccion.value + "</p>";
  }
  if (notas !== "") {
    resumen += "<p class='mb-1'>📝 " + notas + "</p>";
  }
  if (descuento > 0) {
    resumen += "<p class='mb-1 text-success'>🎁 Descuento del " + descuento + "%</p>";
  }
  resumen += "<p class='mb-0'>💳 " + valor("pedPago") + " · <strong>Total: " + formatoPrecio(calcularTotal()) + "</strong></p>";

  // Número de pedido inventado, por ejemplo DC-4821
  ponerTexto("numPedido", "DC-" + Math.floor(1000 + Math.random() * 9000));
  document.getElementById("resumenPedido").innerHTML = resumen;

  // Cambiamos el formulario por la confirmación
  mostrar(formPedido, false);
  mostrar(pedidoListo, true);
  window.scrollTo(0, 0);

  // Vaciamos el carrito
  carrito = [];
  mostrarCarrito();
});


// ---------- AL CARGAR LA PÁGINA ----------
alCambiarCarrito();
