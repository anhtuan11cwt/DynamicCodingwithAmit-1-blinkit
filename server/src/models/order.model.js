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
    order_status: {
      default: "processing",
      type: String,
    },
    orderId: {
      required: true,
      type: String,
    },
    payment_method: {
      default: "COD",
      type: String,
    },
    payment_status: {
      default: "cash_on_delivery",
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
