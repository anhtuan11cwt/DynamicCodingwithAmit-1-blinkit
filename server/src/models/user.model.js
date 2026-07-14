import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    address_details: [
      {
        ref: "address",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    avatar: {
      default: "",
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
    },
    forgot_password_expiry: {
      default: null,
      type: Date,
    },
    forgot_password_otp: {
      default: null,
      type: String,
    },
    last_login_date: {
      default: null,
      type: Date,
    },
    mobile: {
      default: null,
      type: String,
    },
    name: {
      default: "",
      type: String,
    },
    order_history: [
      {
        ref: "order",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    password: {
      required: true,
      type: String,
    },
    refresh_token: {
      default: "",
      type: String,
    },
    role: {
      default: "USER",
      enum: ["ADMIN", "USER"],
      type: String,
    },
    shopping_cart: [
      {
        ref: "cartProduct",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    status: {
      default: "Active",
      enum: ["Active", "Inactive", "Suspended"],
      type: String,
    },
    verify_email: {
      default: false,
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("user", userSchema);

export default userModel;
