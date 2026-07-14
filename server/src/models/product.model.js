import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    category: [
      {
        ref: "category",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    description: {
      default: "",
      type: String,
    },
    discount: {
      default: null,
      type: Number,
    },
    image: {
      default: [],
      type: [String],
    },
    more_details: {
      default: {},
      type: Object,
    },
    name: {
      default: "",
      type: String,
    },
    price: {
      default: null,
      type: Number,
    },
    publish: {
      default: true,
      type: Boolean,
    },
    stock: {
      default: 0,
      type: Number,
    },
    subCategory: [
      {
        ref: "subCategory",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    unit: {
      default: "",
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("product", productSchema);

export default productModel;
