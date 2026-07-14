import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    image: {
      default: "",
      type: String,
    },
    name: {
      default: "",
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const categoryModel = mongoose.model("category", categorySchema);

export default categoryModel;
