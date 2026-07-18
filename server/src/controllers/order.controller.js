import mongoose from "mongoose";
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
