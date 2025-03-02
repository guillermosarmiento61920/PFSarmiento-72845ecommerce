const socket = io();

// ejemplo de agregar products
document.getElementById("agregarProducto").addEventListener("click", () => {
  const nuevoProducto = {
    title: "producto nuevo",
    description: "descripción",
    price: 100,
    code: "ABC123",
    stock: 10,
  };
  socket.emit("nuevoProducto", nuevoProducto);
});

document.getElementById("eliminarProducto").addEventListener("click", () => {
  const idProducto = 1;
  socket.emit("eliminarProducto", idProducto);
});
