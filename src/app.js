// app.js:
import express from "express";
import { Server } from "socket.io";
import http from "http";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import realTimeProductsRouter from "./routes/realTimeProducts.router.js";
import { engine } from "express-handlebars";
import cartRouter from "./routes/cart.router.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/db.js";
import Product from "./models/product.model.js";

//para actualizar variables de entorno
dotenv.config();

// genero servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

// configuración de express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../public")));

// Configuracion handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

connectMongoDB();

// Rutas
app.use("/", viewsRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);
app.use("/realtimeproducts", realTimeProductsRouter);

// websocket
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("nuevoProducto", async (producto) => {
    try {
      await Product.create(producto);
      const updatedProducts = await Product.find().lean();
      socket.emit("actualizarProductos", updatedProducts);
    } catch (error) {
      console.error("Error al crear producto:", error.message);
    }
  });

  socket.on("eliminarProducto", async (id) => {
    try {
      await Product.findByIdAndDelete(id);
      const updatedProducts = await Product.find().lean();
      socket.emit("actualizarProductos", updatedProducts);
      
    } catch (error) {
      console.error("Error al crear producto:", error.message);
      
    }
  });

  socket.on("filterByCategory", async (category) => {
    try {
      const filteredProducts = await Product.find({ category }).lean();
      socket.emit("actualizarProductos", filteredProducts);
    } catch (error) {
      console.error("Error al filtrar productos:", error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
