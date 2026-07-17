import CartProductModel from "../models/cartproduct.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import {
  addToCartSchema,
  deleteCartSchema,
  updateCartSchema,
} from "../validations/cart.validation.js";

export const addToCartItem = async (req, res) => {
  try {
    const parsed = addToCartSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const userId = req.userId;
    const { productId } = parsed.data;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    if (Number(product.stock) <= 0) {
      return res.status(400).json({
        error: true,
        message: "Sản phẩm đã hết hàng",
        success: false,
      });
    }

    const existing = await CartProductModel.findOne({ productId, userId });

    if (existing) {
      return res.json({
        error: false,
        message: "Sản phẩm đã có trong giỏ hàng",
        success: true,
      });
    }

    const cartItem = new CartProductModel({
      productId,
      quantity: 1,
      userId,
    });

    await cartItem.save();

    await UserModel.updateOne(
      { _id: userId },
      { $push: { shopping_cart: cartItem._id } },
    );

    return res.json({
      error: false,
      message: "Đã thêm vào giỏ hàng",
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

export const getCartItemController = async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await CartProductModel.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    return res.json({
      data: cartItems,
      error: false,
      message: "Lấy giỏ hàng thành công",
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

export const updateCartItemQuantityController = async (req, res) => {
  try {
    const parsed = updateCartSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const userId = req.userId;
    const { _id, quantity } = parsed.data;

    const updated = await CartProductModel.updateOne(
      { _id, userId },
      { quantity },
    );

    if (updated.matchedCount === 0) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy mục giỏ hàng",
        success: false,
      });
    }

    return res.json({
      error: false,
      message: "Cập nhật số lượng thành công",
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

export const deleteCartItemQtyController = async (req, res) => {
  try {
    const parsed = deleteCartSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const userId = req.userId;
    const { _id } = parsed.data;

    const cart = await CartProductModel.findOne({ _id, userId });

    if (!cart) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy mục giỏ hàng",
        success: false,
      });
    }

    await CartProductModel.deleteOne({ _id });

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { shopping_cart: _id } },
    );

    return res.json({
      error: false,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
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
