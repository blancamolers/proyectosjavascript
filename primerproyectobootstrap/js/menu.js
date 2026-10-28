// ================================================
//   PÁGINA DEL MENÚ (menu.html)
// ================================================


// ---------- PRODUCTOS DEL MENÚ ----------
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
  const insignia = producto.insignia ? `<span class="badge rounded-pill text-bg-dark position-absolute top-0 end-0 m-2">${producto.insignia}</span>` : "";

  fila.innerHTML += `
    <div class="col aparecer">
      <div class="card h-100 border-0 rounded-4 shadow-sm overflow-hidden levantar">
        ${insignia}
        <img src="img/${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text text-body-secondary">${producto.descripcion}</p>
        </div>
        <div class="card-footer bg-transparent border-0 pt-0 pb-3 d-flex justify-content-between align-items-center">
          <span class="precio fs-5 text-primary">${formatoPrecio(producto.precio)}</span>
          <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="agregar(this, ${indice})">+ Agregar</button>
        </div>
      </div>
    </div>`;
});

// Las tarjetas son nuevas, así que les activamos la animación
activarAnimaciones();


// ---------- BOTÓN "+ AGREGAR" ----------
function agregar(boton, indice) {
  agregarAlCarrito(productos[indice].nombre, productos[indice].precio);

  // El botón dice "✓ Agregado" un momento
  boton.textContent = "✓ Agregado";
  boton.disabled = true;
  setTimeout(function () {
    boton.textContent = "+ Agregar";
    boton.disabled = false;
  }, 800);
}


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
    document.querySelector(".btn-filtro.active").classList.remove("active");
    boton.classList.add("active");
    filtroActual = boton.dataset.filtro;
    aplicarFiltros();
  });
});
