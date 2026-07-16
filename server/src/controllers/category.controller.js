import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import {
  deleteImageCloudinary,
  getPublicIdFromUrl,
} from "../utils/uploadImageCloudinary.js";

export const addCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        error: true,
        message: "Vui lòng cung cấp đầy đủ tên và hình ảnh danh mục",
        success: false,
      });
    }

    const category = new CategoryModel({
      image,
      name,
    });

    const savedCategory = await category.save();

    return res.status(201).json({
      data: savedCategory,
      error: false,
      message: "Tạo danh mục thành công",
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

export const getCategoryController = async (_req, res) => {
  try {
    const categories = await CategoryModel.find().sort({ createdAt: -1 });

    return res.json({
      data: categories,
      error: false,
      message: "Lấy danh sách danh mục thành công",
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

export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID danh mục",
        success: false,
      });
    }

    const existing = await CategoryModel.findById(_id);

    if (!existing) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy danh mục",
        success: false,
      });
    }

    if (existing.image && existing.image !== image) {
      const publicId = getPublicIdFromUrl(existing.image);
      if (publicId) {
        await deleteImageCloudinary(publicId).catch(() => {});
      }
    }

    const updated = await CategoryModel.findByIdAndUpdate(
      _id,
      { image, name },
      { new: true },
    );

    return res.json({
      data: updated,
      error: false,
      message: "Cập nhật danh mục thành công",
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

export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID danh mục",
        success: false,
      });
    }

    const usedInSubCategory = await SubCategoryModel.findOne({
      category: { $in: [_id] },
    });

    const usedInProduct = await ProductModel.findOne({
      category: { $in: [_id] },
    });

    if (usedInSubCategory || usedInProduct) {
      return res.status(400).json({
        error: true,
        message: "Danh mục đang được sử dụng, không thể xóa",
        success: false,
      });
    }

    const category = await CategoryModel.findById(_id);

    if (!category) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy danh mục",
        success: false,
      });
    }

    if (category.image) {
      const publicId = getPublicIdFromUrl(category.image);
      if (publicId) {
        await deleteImageCloudinary(publicId).catch(() => {});
      }
    }

    await CategoryModel.findByIdAndDelete(_id);

    return res.json({
      error: false,
      message: "Xóa danh mục thành công",
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
