// ================================================
//   PÁGINA DE INICIO (index.html)
// ================================================

// "Lo más pedido": los productos de datos.js que tienen insignia
const destacados = document.getElementById("destacados");

productos.forEach(function (producto, indice) {
  if (producto.insignia) {
    destacados.innerHTML += htmlTarjeta(producto, indice);
  }
});

// Las tarjetas son nuevas, así que les activamos la animación
activarAnimaciones();
