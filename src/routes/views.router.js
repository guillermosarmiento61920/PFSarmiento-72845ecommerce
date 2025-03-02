// ./routes/views.router.js:
import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // para incorporar query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const products = await Product.paginate({}, { limit, page, lean: true });

    res.render("home", {
      products: products.docs,
      page,
      totalPages: products.totalPages,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;
