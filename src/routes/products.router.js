import { Router } from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const router = Router();

// const category = await Product.distinct("category");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    const categories = await Product.distinct("category");

    res.render("products", { products, categories });
    req.io.emit('actualizarProductos', await Product.find());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/api", async (req, res) => {
  try {

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const products = await Product.paginate({}, {limit, page, lean: true});

    res.json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: `http://localhost:8080/products/api?page=${products.prevPage}&limit=${limit}`,
      nextLink: `http://localhost:8080/products/api?page=${products.nextPage}&limit=${limit}`,
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid).lean();

    const cart = await Cart.findOne().lean();
    const cid = cart ? cart._id.toString() : null;

    res.render("product", {product, cid});

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    const response = await Product.insertOne({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    });
    res.status(201).send({ status: "sucess", payload: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productUpdate = req.body;

    const response = await Product.updateOne({ _id: pid }, productUpdate);
    // req.io.emit("actualizarProductos", await productManager.getProducts());
    res.status(201).send({ status: "sucess", payload: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const response = await Product.deleteOne({ _id: pid });
    // req.io.emit("actualizarProductos", await productManager.getProducts());
    res.status(200).send({
      status: "success",
      message: `Producto con ID ${pid} eliminado.`,
      payload: response,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
