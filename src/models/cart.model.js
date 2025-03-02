import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    default: [],
  },
});

cartSchema.pre("find", function(next){
  this.populate("products.product");
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
