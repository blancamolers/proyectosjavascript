// ================================================
//   PÁGINA DEL MENÚ (menu.html)
// ================================================
// Los productos están en datos.js y la tarjeta en comun.js.


// ---------- TARJETAS ----------
// Una tarjeta por producto, dentro de su categoría
productos.forEach(function (producto, indice) {
  const fila = document.querySelector('.grupo[data-categoria="' + producto.categoria + '"] .row');
  fila.innerHTML += htmlTarjeta(producto, indice);
});

// Las tarjetas son nuevas, así que les activamos la animación
activarAnimaciones();


// ---------- BUSCADOR Y FILTROS ----------

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
    const anterior = document.querySelector(".btn-filtro.active");
    anterior.classList.remove("active");
    anterior.setAttribute("aria-pressed", "false");
    boton.classList.add("active");
    boton.setAttribute("aria-pressed", "true");
    filtroActual = boton.dataset.filtro;
    aplicarFiltros();
  });
});
