import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    delivery_address: {
      ref: "address",
      type: mongoose.Schema.Types.ObjectId,
    },
    invoice_receipt: {
      default: "",
      type: String,
    },
    orderId: {
      required: true,
      type: String,
      unique: true,
    },
    payment_status: {
      default: "",
      type: String,
    },
    paymentId: {
      default: "",
      type: String,
    },
    product_details: {
      image: {
        default: "",
        type: String,
      },
      name: {
        default: "",
        type: String,
      },
    },
    product_id: {
      ref: "product",
      type: mongoose.Schema.Types.ObjectId,
    },
    subTotalAmt: {
      default: 0,
      type: Number,
    },
    totalAmt: {
      default: 0,
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

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;
