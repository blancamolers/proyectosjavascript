// ================================================
//   DATOS DEL NEGOCIO Y DEL MENÚ
// ================================================
// Todo lo que cambia de un negocio a otro está AQUÍ.
// Cambia estos datos y se actualizan solos en todas las páginas:
// el pie, la página de información, los pedidos por WhatsApp...
//
// ⚠️ Antes de publicar la web, pon los datos reales donde ves "CAMBIAR".

const NEGOCIO = {
  nombre: "Dalbit Café",
  direccion: "Calle de las Flores 24, Madrid",     // CAMBIAR
  telefono: "+34 600 000 000",                     // CAMBIAR: se ve en la web
  whatsapp: "34600000000",                         // CAMBIAR: el mismo número, sin "+" ni espacios
  email: "hola@dalbitcafe.com",                    // CAMBIAR
  instagram: "https://www.instagram.com/",         // CAMBIAR: enlace a la cuenta del negocio
  tiktok: "https://www.tiktok.com/",               // CAMBIAR

  // Horario. JavaScript cuenta los días así: 0 = domingo, 1 = lunes ... 6 = sábado
  horario: [
    { dia: "Domingo",   abre: "10:00", cierra: "20:00" },
    { dia: "Lunes",     abre: "09:00", cierra: "21:00" },
    { dia: "Martes",    abre: "09:00", cierra: "21:00" },
    { dia: "Miércoles", abre: "09:00", cierra: "21:00" },
    { dia: "Jueves",    abre: "09:00", cierra: "21:00" },
    { dia: "Viernes",   abre: "09:00", cierra: "21:00" },
    { dia: "Sábado",    abre: "10:00", cierra: "22:00" }
  ],

  // Envío a domicilio
  costeEnvio: 2.5,          // lo que cuesta el envío
  envioGratisDesde: 20,     // desde este importe el envío es gratis

  // Códigos de descuento: código → porcentaje
  cupones: {
    DALBIT10: 10,
    CROFFLE20: 20
  }
};


// ---------- PRODUCTOS DEL MENÚ ----------
// Para añadir un producto nuevo, copia una línea y cámbiala.
// "insignia" es opcional ("Popular", "Nuevo"...). Los que la tienen salen en la portada.

const productos = [
  { categoria: "bebidas", nombre: "Latte de Fresa", precio: 4.50, imagen: "latte-fresa.svg", descripcion: "Leche fría con puré de fresa natural." },
  { categoria: "bebidas", nombre: "Café Dalgona",   precio: 4.00, imagen: "cafe-dalgona.svg", descripcion: "Espuma de café batido sobre leche." },
  { categoria: "bebidas", nombre: "Matcha Latte",   precio: 4.50, imagen: "matcha-latte.svg", descripcion: "Té verde japonés con leche de avena." },
  { categoria: "bebidas", nombre: "Té de Yuzu",     precio: 3.50, imagen: "te-yuzu.svg",      descripcion: "Cítrico coreano, caliente o con hielo." },

  { categoria: "postres", nombre: "Croffle",            precio: 5.00, imagen: "croffle.svg",     descripcion: "Con miel, helado de vainilla o Nutella." },
  { categoria: "postres", nombre: "Bingsu",             precio: 8.50, imagen: "bingsu.svg",      descripcion: "Fresa, mango o matcha. Para compartir.", insignia: "Popular" },
  { categoria: "postres", nombre: "Mochi Tteok",        precio: 3.50, imagen: "mochi-tteok.svg", descripcion: "Pastelitos de arroz rellenos de crema." },
  { categoria: "postres", nombre: "Pan de Ajo Coreano", precio: 4.50, imagen: "pan-ajo.svg",     descripcion: "Relleno de queso crema y mantequilla de ajo.", insignia: "Nuevo" },

  { categoria: "croissants", nombre: "Croissant de Mantequilla", precio: 2.80, imagen: "croissant-mantequilla.svg", descripcion: "El clásico francés: hojaldrado, dorado y crujiente." },
  { categoria: "croissants", nombre: "Croissant de Chocolate",   precio: 3.50, imagen: "croissant-chocolate.svg",   descripcion: "Relleno de chocolate y con hilos de cacao por encima.", insignia: "Popular" },
  { categoria: "croissants", nombre: "Croissant de Almendras",   precio: 3.90, imagen: "croissant-almendras.svg",   descripcion: "Crema de almendra, almendras laminadas y azúcar glas.", insignia: "Nuevo" },
  { categoria: "croissants", nombre: "Croissant de Matcha",      precio: 3.80, imagen: "croissant-matcha.svg",      descripcion: "Glaseado de té verde con un toque de matcha en polvo." }
];
