import ProductModel from "../models/product.model.js";
import {
  deleteImageCloudinary,
  getPublicIdFromUrl,
} from "../utils/uploadImageCloudinary.js";
import {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

export const createProductController = async (req, res) => {
  try {
    const parsed = createProductSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const {
      category,
      description,
      discount,
      image,
      more_details,
      name,
      price,
      publish,
      stock,
      subCategory,
      unit,
    } = parsed.data;

    const product = new ProductModel({
      category,
      description: description || "",
      discount: discount ?? null,
      image,
      more_details: more_details || {},
      name,
      price,
      publish,
      stock: stock ?? 0,
      subCategory,
      unit,
    });

    const savedProduct = await product.save();

    return res.json({
      data: savedProduct,
      error: false,
      message: "Tạo sản phẩm thành công",
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

export const updateProductController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID sản phẩm",
        success: false,
      });
    }

    const parsed = updateProductSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const existing = await ProductModel.findById(_id);

    if (!existing) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    const oldImages = existing.image || [];
    const newImages = parsed.data.image || oldImages;

    const removedImages = oldImages.filter((img) => !newImages.includes(img));

    for (const img of removedImages) {
      const publicId = getPublicIdFromUrl(img);
      if (publicId) {
        await deleteImageCloudinary(publicId).catch(() => {});
      }
    }

    const updated = await ProductModel.findByIdAndUpdate(
      _id,
      { $set: parsed.data },
      { new: true },
    );

    return res.json({
      data: updated,
      error: false,
      message: "Cập nhật sản phẩm thành công",
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

export const deleteProductController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID sản phẩm",
        success: false,
      });
    }

    const product = await ProductModel.findById(_id);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    if (product.image?.length > 0) {
      for (const img of product.image) {
        const publicId = getPublicIdFromUrl(img);
        if (publicId) {
          await deleteImageCloudinary(publicId).catch(() => {});
        }
      }
    }

    await ProductModel.findByIdAndDelete(_id);

    return res.json({
      error: false,
      message: "Xóa sản phẩm thành công",
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

export const getProductByIdController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID sản phẩm",
        success: false,
      });
    }

    const product = await ProductModel.findById(_id);

    if (!product) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy sản phẩm",
        success: false,
      });
    }

    return res.json({
      data: product,
      error: false,
      message: "Lấy sản phẩm thành công",
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

export const getProductController = async (req, res) => {
  try {
    const parsed = getProductSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { limit, page, search } = parsed.data;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const query = search ? { $text: { $search: search } } : {};

    const [products, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),
      ProductModel.countDocuments(query),
    ]);

    const totalPage = Math.ceil(totalCount / limitNumber);

    return res.json({
      data: products,
      error: false,
      limit: limitNumber,
      message: "Lấy danh sách sản phẩm thành công",
      page: pageNumber,
      success: true,
      totalCount,
      totalPage,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message || "Đã xảy ra lỗi",
      success: false,
    });
  }
};
