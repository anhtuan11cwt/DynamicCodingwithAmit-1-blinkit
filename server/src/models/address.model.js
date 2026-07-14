import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    address_line: {
      default: "",
      type: String,
    },
    city: {
      default: "",
      type: String,
    },
    mobile: {
      default: null,
      type: String,
    },
    pincode: {
      default: null,
      type: String,
    },
    state: {
      default: "",
      type: String,
    },
    status: {
      default: true,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const addressModel = mongoose.model("address", addressSchema);

export default addressModel;
