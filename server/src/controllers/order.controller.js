import mongoose from "mongoose";
import "dotenv/config";
import stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import orderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import { cashOnDeliverySchema } from "../validations/order.validation.js";

export const cashOnDeliveryOrderController = async (req, res) => {
  try {
    const parsed = cashOnDeliverySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { list_items, addressId, subTotalAmt, totalAmt } = parsed.data;
    const userId = req.userId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    const address = await UserModel.findById(userId).populate({
      match: { _id: addressId, status: true },
      path: "address_details",
    });

    const selectedAddress = address?.address_details?.[0];
    if (!selectedAddress) {
      return res.status(404).json({
        error: true,
        message: "Địa chỉ không hợp lệ",
        success: false,
      });
    }

    const orderId = new mongoose.Types.ObjectId().toString();

    const orderData = list_items.map((item) => ({
      delivery_address: selectedAddress._id,
      order_status: "processing",
      orderId,
      payment_method: "COD",
      payment_status: "cash_on_delivery",
      product_details: {
        image: item.image?.[0] || "",
        name: item.name,
      },
      product_id: item.productId,
      subTotalAmt: subTotalAmt || 0,
      totalAmt: totalAmt || 0,
      userId,
    }));

    await orderModel.insertMany(orderData);

    const cartItemIds = list_items.map((item) => item._id);
    await CartProductModel.deleteMany({ _id: { $in: cartItemIds } });
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { shopping_cart: { $in: cartItemIds } },
    });

    return res.status(201).json({
      data: {
        order_count: orderData.length,
        orderId,
      },
      message: "Đặt hàng thành công",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};

export const paymentSuccessController = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.userId;

    if (!sessionId) {
      return res.status(400).json({
        error: true,
        message: "Thiếu sessionId",
        success: false,
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        error: true,
        message: "Thanh toán chưa được xác nhận",
        success: false,
      });
    }

    const existingOrders = await orderModel.find({
      paymentId: session.payment_intent,
      userId,
    });

    if (existingOrders.length > 0) {
      return res.status(200).json({
        data: {
          order_count: existingOrders.length,
          orderId: existingOrders[0].orderId,
        },
        message: "Đơn hàng đã được xử lý",
        success: true,
      });
    }

    const addressId = session.metadata.addressId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy người dùng",
        success: false,
      });
    }

    const address = await UserModel.findById(userId).populate({
      match: { _id: addressId, status: true },
      path: "address_details",
    });

    const selectedAddress = address?.address_details?.[0];
    if (!selectedAddress) {
      return res.status(404).json({
        error: true,
        message: "Địa chỉ không hợp lệ",
        success: false,
      });
    }

    const cartItems = await CartProductModel.find({ userId }).populate(
      "productId",
    );

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Giỏ hàng trống",
        success: false,
      });
    }

    const orderId = new mongoose.Types.ObjectId().toString();

    const orderData = cartItems
      .filter((item) => item?.productId)
      .map((item) => {
        const product = item.productId;
        return {
          delivery_address: selectedAddress._id,
          order_status: "processing",
          orderId,
          payment_method: "ONLINE",
          payment_status: "paid",
          paymentId: session.payment_intent || session.id,
          product_details: {
            image: product.image?.[0] || "",
            name: product.name,
          },
          product_id: product._id,
          subTotalAmt: cartItems.reduce((sum, ci) => {
            const p = ci.productId;
            if (!p) return sum;
            const discounted =
              p.discount > 0 ? p.price - (p.price * p.discount) / 100 : p.price;
            return sum + discounted * (Number(ci.quantity) || 1);
          }, 0),
          totalAmt: cartItems.reduce((sum, ci) => {
            const p = ci.productId;
            if (!p) return sum;
            const discounted =
              p.discount > 0 ? p.price - (p.price * p.discount) / 100 : p.price;
            return sum + discounted * (Number(ci.quantity) || 1);
          }, 0),
          userId,
        };
      });

    await orderModel.insertMany(orderData);

    const cartItemIds = cartItems.map((item) => item._id);
    await CartProductModel.deleteMany({ _id: { $in: cartItemIds } });
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { shopping_cart: { $in: cartItemIds } },
    });

    return res.status(201).json({
      data: {
        order_count: orderData.length,
        orderId,
      },
      message: "Đặt hàng thành công",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};

export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ userId })
      .populate("delivery_address")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      data: orders,
      message: "Lấy danh sách đơn hàng thành công",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};
