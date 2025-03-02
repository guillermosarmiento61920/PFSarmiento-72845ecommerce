// ./routes/realTimeProducts.router.js:
import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
        const products = await Product.find().lean();
        res.render("realTimeProducts", { products: products });
  } catch (error) {
    res.status(500).send({ status: "error", error: error.message });
  }
});

export default router;
