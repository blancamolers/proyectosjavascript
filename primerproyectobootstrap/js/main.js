// Cuando se envía el formulario de reserva, mostramos un mensaje de confirmación
const formReserva = document.getElementById("formReserva");
const mensajeOk = document.getElementById("mensajeOk");

formReserva.addEventListener("submit", function (evento) {
  evento.preventDefault();          // evita que la página se recargue
  mensajeOk.classList.remove("d-none"); // muestra el mensaje
  formReserva.reset();              // limpia los campos
});

// Cuando se cierra el modal, volvemos a ocultar el mensaje
document.getElementById("modalReserva").addEventListener("hidden.bs.modal", function () {
  mensajeOk.classList.add("d-none");
});
