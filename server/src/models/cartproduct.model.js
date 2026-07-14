import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      ref: "product",
      type: mongoose.Schema.Types.ObjectId,
    },
    quantity: {
      default: 1,
      type: Number,
    },
    userId: {
      ref: "user",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

const cartProductModel = mongoose.model("cartProduct", cartProductSchema);

export default cartProductModel;
