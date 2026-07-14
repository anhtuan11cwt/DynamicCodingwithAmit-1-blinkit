import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    category: [
      {
        ref: "category",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
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

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

export default subCategoryModel;
