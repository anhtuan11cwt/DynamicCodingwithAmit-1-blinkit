import "dotenv/config";
import stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const paymentController = async (req, res) => {
  try {
    const { addressId } = req.body;
    const userId = req.userId;

    if (!addressId) {
      return res.status(400).json({
        error: true,
        message: "Thiếu địa chỉ giao hàng",
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

    const lineItems = cartItems
      .filter((item) => item?.productId)
      .map((item) => {
        const product = item.productId;
        const discountedPrice =
          product.discount > 0
            ? product.price - (product.price * product.discount) / 100
            : product.price;

        return {
          price_data: {
            currency: "vnd",
            product_data: {
              images: product.image || [],
              name: product.name,
            },
            unit_amount: Math.round(discountedPrice),
          },
          quantity: Number(item.quantity) || 1,
        };
      });

    const session = await stripe.checkout.sessions.create({
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      line_items: lineItems,
      metadata: {
        addressId: addressId.toString(),
        userId: userId.toString(),
      },
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return res.status(200).json({
      sessionId: session.id,
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
