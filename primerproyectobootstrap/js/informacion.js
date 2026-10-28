// ================================================
//   PÁGINA DE INFORMACIÓN (informacion.html)
// ================================================

// Tabla del horario de lunes a domingo, con el día de hoy marcado
const numeroHoy = new Date().getDay();
let filas = "";

SEMANA.forEach(function (numero) {
  const dia = NEGOCIO.horario[numero];

  if (numero === numeroHoy) {
    filas += `<tr class="table-active fw-bold"><td>${dia.dia} (hoy)</td><td class="text-end">${dia.abre} – ${dia.cierra}</td></tr>`;
  } else {
    filas += `<tr><td>${dia.dia}</td><td class="text-end">${dia.abre} – ${dia.cierra}</td></tr>`;
  }
});

document.getElementById("tablaHorario").innerHTML = filas;
