// ./routes/cart.router.js:
import express from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const cartRouter = express.Router();

cartRouter.get("/api", async (req, res) => {
  try {
    const cart = await Cart.find().lean();
    res.status(201).send({ status: "sucess", payload: cart });
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product").lean();
    if (!cart) {
      return res.status(404).send({ message: "Carrito no encontrado" });
    }
   
    res.render ("cartProducts", {cart});
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await Cart.create({});
    res.status(201).send({ status: "sucess", payload: newCart });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send({ message: "Carrito no ecotrnado" });

    const product = await Product.findById(pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === pid
    );
    if (existingProduct) {
      existingProduct.quantity += quantity || 1;
    } else {
      cart.products.push({ product: pid, quantity: quantity || 1 });
    }

    await cart.save();

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).send({ message: "Carrito no ecotrnado" });

    const product = await Product.findById(pid);
    if (!product)
      return res.status(404).json({ error: "Producto no encontrado" });
    cart.products = cart.products.filter((p) => p.product.toString() !== pid);

    await cart.save();

    res.status(200).json ({message: "Producto eliminado del carrito", cart});
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const response = await Cart.deleteOne({ _id: cid });
    res.status(200).send({
      status: "success",
      message: `Carrito con ID ${cid} eliminado.`,
      payload: response,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default cartRouter;
