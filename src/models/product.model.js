// ./models/product.model.js:
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  code: {type: String, required: true, unique: true},
  price: {type: Number , required: true},
  status: {type: Boolean, default: true},
  stock: {type: Number , required: true},
  category: {type: String, required: true, index: "text"},
  thumbnail: {type: Date, default: Date.now},
})

productSchema.plugin(paginate);
const Product = mongoose.model("Product", productSchema);

export default Product;