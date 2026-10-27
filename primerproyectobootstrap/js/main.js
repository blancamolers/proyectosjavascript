// ================================================
//              FUNCIONES DE AYUDA
// ================================================
// Pequeñas funciones que usamos muchas veces en el código

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


// ================================================
//                PRODUCTOS DEL MENÚ
// ================================================
// Para agregar un producto nuevo solo copia una línea y cámbiala.
// "insignia" es opcional: "Popular", "Nuevo"...

const productos = [
  { categoria: "bebidas", nombre: "Latte de Fresa", precio: 4.50, imagen: "latte-fresa.svg", descripcion: "Leche fría con puré de fresa natural." },
  { categoria: "bebidas", nombre: "Café Dalgona",   precio: 4.00, imagen: "cafe-dalgona.svg", descripcion: "Espuma de café batido sobre leche." },
  { categoria: "bebidas", nombre: "Matcha Latte",   precio: 4.50, imagen: "matcha-latte.svg", descripcion: "Té verde japonés con leche de avena." },
  { categoria: "bebidas", nombre: "Té de Yuzu",     precio: 3.50, imagen: "te-yuzu.svg",      descripcion: "Cítrico coreano caliente o con hielo." },

  { categoria: "postres", nombre: "Croffle",            precio: 5.00, imagen: "croffle.svg",     descripcion: "Con miel, helado de vainilla o Nutella." },
  { categoria: "postres", nombre: "Bingsu",             precio: 8.50, imagen: "bingsu.svg",      descripcion: "Fresa, mango o matcha. Para compartir.", insignia: "Popular" },
  { categoria: "postres", nombre: "Mochi Tteok",        precio: 3.50, imagen: "mochi-tteok.svg", descripcion: "Pastelitos de arroz rellenos de crema." },
  { categoria: "postres", nombre: "Pan de Ajo Coreano", precio: 4.50, imagen: "pan-ajo.svg",     descripcion: "Relleno de queso crema y mantequilla de ajo.", insignia: "Nuevo" },

  { categoria: "croissants", nombre: "Croissant de Mantequilla", precio: 2.80, imagen: "croissant-mantequilla.svg", descripcion: "El clásico francés: hojaldrado, dorado y crujiente." },
  { categoria: "croissants", nombre: "Croissant de Chocolate",   precio: 3.50, imagen: "croissant-chocolate.svg",   descripcion: "Relleno de chocolate y con hilos de cacao encima.", insignia: "Popular" },
  { categoria: "croissants", nombre: "Croissant de Almendras",   precio: 3.90, imagen: "croissant-almendras.svg",   descripcion: "Crema de almendra, almendras laminadas y azúcar glas.", insignia: "Nuevo" },
  { categoria: "croissants", nombre: "Croissant de Matcha",      precio: 3.80, imagen: "croissant-matcha.svg",      descripcion: "Glaseado de té verde con un toque de matcha en polvo." }
];

// Creamos una tarjeta por cada producto, dentro de su categoría
productos.forEach(function (producto, indice) {
  const fila = document.querySelector('.grupo[data-categoria="' + producto.categoria + '"] .row');
  const insignia = producto.insignia ? `<span class="badge insignia">${producto.insignia}</span>` : "";

  fila.innerHTML += `
    <div class="col aparecer">
      <div class="card tarjeta h-100">
        ${insignia}
        <img src="img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text texto-suave">${producto.descripcion}</p>
        </div>
        <div class="card-footer d-flex justify-content-between align-items-center">
          <span class="precio">${formatoPrecio(producto.precio)}</span>
          <button class="btn btn-rosa btn-sm" onclick="agregar(this, ${indice})">+ Agregar</button>
        </div>
      </div>
    </div>`;
});


// ================================================
//                RESERVAR MESA
// ================================================

const formReserva = document.getElementById("formReserva");
const mensajeOk = document.getElementById("mensajeOk");

formReserva.addEventListener("submit", function (evento) {
  evento.preventDefault();   // evita que la página se recargue
  mostrar(mensajeOk, true);
  formReserva.reset();       // limpia los campos
});

// Cuando se cierra el modal, volvemos a ocultar el mensaje
document.getElementById("modalReserva").addEventListener("hidden.bs.modal", function () {
  mostrar(mensajeOk, false);
});


// ================================================
//            ANIMACIÓN AL HACER SCROLL
// ================================================

// Cuando una tarjeta entra en la pantalla, le ponemos la clase "visible"
const observador = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      entrada.target.classList.add("visible");
    }
  });
});

document.querySelectorAll(".aparecer").forEach(function (elemento) {
  observador.observe(elemento);
});

// Botón "volver arriba": aparece cuando bajas más de 400px
const btnArriba = document.getElementById("btnArriba");

window.addEventListener("scroll", function () {
  btnArriba.classList.toggle("mostrar", window.scrollY > 400);
});


// ================================================
//            BUSCADOR Y FILTRO DEL MENÚ
// ================================================

const buscador = document.getElementById("buscador");
let filtroActual = "todos";

// Muestra solo lo que coincide con la categoría elegida Y con lo que se escribió
function aplicarFiltros() {
  const texto = buscador.value.toLowerCase();
  let gruposVisibles = 0;

  document.querySelectorAll(".grupo").forEach(function (grupo) {
    let tarjetasVisibles = 0;

    grupo.querySelectorAll(".col").forEach(function (col) {
      const nombre = col.querySelector(".card-title").textContent.toLowerCase();
      const coincide = nombre.includes(texto);
      mostrar(col, coincide);
      if (coincide) {
        tarjetasVisibles++;
        col.classList.add("visible"); // que no se quede invisible por la animación
      }
    });

    const categoriaOk = filtroActual === "todos" || grupo.dataset.categoria === filtroActual;
    const verGrupo = categoriaOk && tarjetasVisibles > 0;
    mostrar(grupo, verGrupo);
    if (verGrupo) {
      gruposVisibles++;
    }
  });

  mostrar(document.getElementById("sinResultados"), gruposVisibles === 0);
}

buscador.addEventListener("input", aplicarFiltros);

document.querySelectorAll(".btn-filtro").forEach(function (boton) {
  boton.addEventListener("click", function () {
    document.querySelector(".btn-filtro.activo").classList.remove("activo");
    boton.classList.add("activo");
    filtroActual = boton.dataset.filtro;
    aplicarFiltros();
  });
});


// ================================================
//                 CARRITO DE PEDIDO
// ================================================

// Reglas de la tienda (cámbialas si quieres)
const COSTO_ENVIO = 2.5;           // precio del envío a domicilio
const ENVIO_GRATIS_DESDE = 20;     // desde este subtotal el envío es gratis
const CUPONES = {                  // código: porcentaje de descuento
  DALBIT10: 10,
  CROFFLE20: 20
};

// Aquí guardamos lo que el cliente va pidiendo.
// Cada producto es así: { nombre: "Croffle", precio: 5, cantidad: 2 }
let carrito = [];
let descuento = 0; // porcentaje del cupón aplicado

// Si el cliente ya tenía algo guardado de antes, lo recuperamos
try {
  carrito = JSON.parse(localStorage.getItem("carritoDalbit")) || [];
} catch (error) {
  carrito = [];
}

// Componentes de Bootstrap que abrimos/cerramos desde JavaScript
const aviso       = new bootstrap.Toast(document.getElementById("aviso"), { delay: 2000 });
const panel       = bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("panelCarrito"));
const modalPedido = new bootstrap.Modal(document.getElementById("modalPedido"));
const btnFormalizar = document.getElementById("btnFormalizar");

// ----- Cuentas -----
function calcularSubtotal() {
  let suma = 0;
  carrito.forEach(function (producto) {
    suma = suma + producto.precio * producto.cantidad;
  });
  return suma;
}

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

// ----- 1. Botón "+ Agregar" de cada tarjeta -----
function agregar(boton, indice) {
  const producto = productos[indice];

  // ¿Ya está en el carrito? Entonces solo sumamos 1
  const existe = carrito.find(function (p) { return p.nombre === producto.nombre; });
  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({ nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }

  mostrarCarrito();
  ponerTexto("textoAviso", "✅ " + producto.nombre + " agregado a tu pedido");
  aviso.show();

  // El botón dice "✓ Agregado" un momento
  boton.textContent = "✓ Agregado";
  boton.disabled = true;
  setTimeout(function () {
    boton.textContent = "+ Agregar";
    boton.disabled = false;
  }, 800);

  // Animación del contador de arriba
  const contador = document.querySelector(".contador");
  contador.classList.remove("saltar");
  void contador.offsetWidth; // truco para que la animación se repita
  contador.classList.add("saltar");
}

// ----- 2. Dibujar el carrito en el panel lateral -----
function mostrarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";
  let piezas = 0;

  carrito.forEach(function (producto, indice) {
    piezas = piezas + producto.cantidad;

    lista.innerHTML += `
      <li class="item-carrito d-flex justify-content-between align-items-center">
        <div>
          <div class="fw-bold">${producto.nombre}</div>
          <small class="texto-suave">${formatoPrecio(producto.precio)} c/u</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button class="btn-cantidad" onclick="cambiarCantidad(${indice}, -1)">−</button>
          <span>${producto.cantidad}</span>
          <button class="btn-cantidad" onclick="cambiarCantidad(${indice}, 1)">+</button>
        </div>
      </li>`;
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
  btnFormalizar.disabled = vacio;

  // Guardamos el carrito para que no se pierda al recargar la página
  try {
    localStorage.setItem("carritoDalbit", JSON.stringify(carrito));
  } catch (error) {
    // si el navegador no deja guardar, no pasa nada
  }
}

// ----- 3. Botones + y − de cada producto -----
function cambiarCantidad(indice, cambio) {
  carrito[indice].cantidad = carrito[indice].cantidad + cambio;

  // Si llega a 0, lo quitamos del carrito
  if (carrito[indice].cantidad === 0) {
    carrito.splice(indice, 1);
  }
  mostrarCarrito();
}

// Botón "Vaciar"
document.getElementById("btnVaciar").addEventListener("click", function () {
  if (carrito.length > 0 && confirm("¿Quieres vaciar todo tu pedido?")) {
    carrito = [];
    mostrarCarrito();
  }
});

// ----- 4. Botón "Formalizar pedido" -----
function mostrarCuentas() {
  ponerTexto("resSubtotal", formatoPrecio(calcularSubtotal()));
  ponerTexto("resDescuento", "− " + formatoPrecio(calcularDescuento()));
  ponerTexto("resEnvio", calcularEnvio() === 0 ? "Gratis" : formatoPrecio(calcularEnvio()));
  ponerTexto("totalModal", formatoPrecio(calcularTotal()));
}

btnFormalizar.addEventListener("click", function () {
  panel.hide();
  mostrarCuentas();
  modalPedido.show();
});

// Mostrar el campo de dirección solo si es "A domicilio"
const campoDireccion = document.getElementById("campoDireccion");
const pedDireccion   = document.getElementById("pedDireccion");

function actualizarDireccion() {
  mostrar(campoDireccion, esDomicilio());
  pedDireccion.required = esDomicilio(); // obligatoria solo para domicilio
}

document.querySelectorAll('input[name="entrega"]').forEach(function (opcion) {
  opcion.addEventListener("change", function () {
    actualizarDireccion();
    mostrarCuentas(); // el envío cambia el total
  });
});

// Código de descuento
const mensajeCupon = document.getElementById("mensajeCupon");

document.getElementById("btnCupon").addEventListener("click", function () {
  const codigo = valor("pedCupon").trim().toUpperCase();
  descuento = CUPONES[codigo] || 0;   // si el código no existe, queda en 0

  if (descuento > 0) {
    mensajeCupon.textContent = "🎁 ¡Cupón aplicado! " + descuento + "% de descuento";
  } else {
    mensajeCupon.textContent = "Ese código no existe 😕";
  }
  mensajeCupon.className = "d-block mb-3 " + (descuento > 0 ? "text-success" : "text-danger");
  mostrarCuentas();
});

// ----- 5. Confirmar el pedido -----
const formPedido  = document.getElementById("formPedido");
const pedidoListo = document.getElementById("pedidoListo");

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

  // Vaciamos el carrito y quitamos el cupón
  carrito = [];
  descuento = 0;
  mostrarCarrito();
});

// Cuando se cierra el modal, lo dejamos listo para el siguiente pedido
document.getElementById("modalPedido").addEventListener("hidden.bs.modal", function () {
  if (!pedidoListo.classList.contains("d-none")) {
    formPedido.reset();
    mensajeCupon.textContent = "";
    actualizarDireccion();
    mostrar(formPedido, true);
    mostrar(pedidoListo, false);
  }
});

// Al cargar la página, dibujamos el carrito
mostrarCarrito();
