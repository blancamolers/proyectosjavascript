// ================================================
//   PÁGINA DE FORMALIZAR PEDIDO (pedido.html)
// ================================================
// El pedido se envía al negocio por WhatsApp, con el mensaje ya escrito.

let descuento = 0;          // porcentaje del cupón aplicado
let numeroPedido = "";      // por ejemplo "DC-4821"

const formPedido     = document.getElementById("formPedido");
const pedidoVacio    = document.getElementById("pedidoVacio");
const pedidoListo    = document.getElementById("pedidoListo");
const pedidoEnviado  = document.getElementById("pedidoEnviado");
const campoDireccion = document.getElementById("campoDireccion");
const pedDireccion   = document.getElementById("pedDireccion");
const pedDia         = document.getElementById("pedDia");
const pedHora        = document.getElementById("pedHora");
const mensajeCupon   = document.getElementById("mensajeCupon");


// ---------- CUENTAS ----------
function esDomicilio() {
  return document.getElementById("domicilio").checked;
}

function calcularEnvio() {
  if (!esDomicilio() || calcularSubtotal() >= NEGOCIO.envioGratisDesde) {
    return 0;
  }
  return NEGOCIO.costeEnvio;
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
  // Si ya estamos en el último paso, no tocamos nada
  if (!pedidoListo.classList.contains("d-none") || !pedidoEnviado.classList.contains("d-none")) {
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


// ---------- DÍA Y HORA ----------
// Solo se puede pedir para hoy o mañana, y dentro del horario de ese día

function fechaElegida() {
  const fecha = new Date();
  if (pedDia.value === "manana") {
    fecha.setDate(fecha.getDate() + 1);
  }
  return fecha;
}

function actualizarHoras() {
  ponerTexto("ayudaHora", limitarHora(pedHora, fechaElegida(), pedDia.value === "hoy"));
}

// Si hoy ya hemos cerrado, el pedido solo puede ser para mañana
if (horaAhora() >= horarioDe(new Date()).cierra) {
  pedDia.querySelector('[value="hoy"]').disabled = true;
  pedDia.value = "manana";
}

pedDia.addEventListener("change", actualizarHoras);
actualizarHoras();


// ---------- RECOGER O A DOMICILIO ----------
// La dirección solo se muestra (y es obligatoria) si es "A domicilio"
function actualizarDireccion() {
  mostrar(campoDireccion, esDomicilio());
  pedDireccion.required = esDomicilio();
}

document.querySelectorAll('input[name="entrega"]').forEach(function (opcion) {
  opcion.addEventListener("change", function () {
    actualizarDireccion();
    alCambiarCarrito(); // el envío cambia el total
  });
});


// ---------- CÓDIGO DE DESCUENTO ----------
document.getElementById("btnCupon").addEventListener("click", function () {
  const codigo = valor("pedCupon").toUpperCase();
  descuento = NEGOCIO.cupones[codigo] || 0;   // si el código no existe, queda en 0

  if (descuento > 0) {
    mensajeCupon.textContent = "🎁 ¡Cupón aplicado! " + descuento + " % de descuento";
  } else {
    mensajeCupon.textContent = "Ese código no existe 😕";
  }
  mensajeCupon.className = "d-block mb-3 " + (descuento > 0 ? "text-success" : "text-danger");
  alCambiarCarrito();
});


// ---------- MENSAJE DEL PEDIDO ----------
// El mismo texto se ve en pantalla y se envía por WhatsApp
function mensajeDelPedido() {
  const lineas = [];

  lineas.push("Hola, quiero hacer un pedido en " + NEGOCIO.nombre + " 🧾");
  lineas.push("Pedido nº " + numeroPedido);
  lineas.push("");

  carrito.forEach(function (p) {
    lineas.push(p.cantidad + " × " + p.nombre + " — " + formatoPrecio(p.precio * p.cantidad));
  });

  lineas.push("");
  if (descuento > 0) {
    lineas.push("🎁 Descuento del " + descuento + " %: − " + formatoPrecio(calcularDescuento()));
  }
  if (esDomicilio()) {
    lineas.push("🛵 Envío: " + (calcularEnvio() === 0 ? "gratis" : formatoPrecio(calcularEnvio())));
  }
  lineas.push("💰 Total: " + formatoPrecio(calcularTotal()));
  lineas.push("");

  lineas.push("👤 " + valor("pedNombre") + " · 📞 " + valor("pedTelefono"));
  if (esDomicilio()) {
    lineas.push("🛵 A domicilio: " + valor("pedDireccion"));
  } else {
    lineas.push("🏪 Lo recojo en el local");
  }
  lineas.push("🕒 " + (pedDia.value === "hoy" ? "Hoy" : "Mañana") + " a las " + valor("pedHora"));
  lineas.push("💳 Pago: " + valor("pedPago"));
  if (valor("pedNotas") !== "") {
    lineas.push("📝 " + valor("pedNotas"));
  }

  return lineas.join("\n");
}


// ---------- CONFIRMAR EL PEDIDO ----------
formPedido.addEventListener("submit", function (evento) {
  evento.preventDefault();

  // Validación de Bootstrap: si falta algo, se pinta en rojo y paramos
  if (!formPedido.checkValidity()) {
    formPedido.classList.add("was-validated");
    formPedido.querySelector(":invalid").focus();
    return;
  }

  // Número de pedido inventado, por ejemplo DC-4821
  numeroPedido = "DC-" + Math.floor(1000 + Math.random() * 9000);

  const mensaje = mensajeDelPedido();
  document.getElementById("resumenPedido").textContent = mensaje;
  document.getElementById("btnWhatsApp").href = enlaceWhatsApp(mensaje);

  // Cambiamos el formulario por el último paso
  mostrar(formPedido, false);
  mostrar(pedidoListo, true);
  window.scrollTo(0, 0);
});

// "← Cambiar algo": volvemos al formulario
document.getElementById("btnEditar").addEventListener("click", function () {
  mostrar(pedidoListo, false);
  mostrar(formPedido, true);
});

// Al enviarlo por WhatsApp, vaciamos el carrito y damos las gracias
document.getElementById("btnWhatsApp").addEventListener("click", function () {
  ponerTexto("nombreGracias", valor("pedNombre"));
  mostrar(pedidoListo, false);
  mostrar(pedidoEnviado, true);
  carrito = [];
  descuento = 0;
  mostrarCarrito();
});


// ---------- AL CARGAR LA PÁGINA ----------
alCambiarCarrito();
