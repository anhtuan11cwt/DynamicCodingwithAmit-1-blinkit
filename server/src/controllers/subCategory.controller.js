import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subCategory.model.js";
import {
  deleteImageCloudinary,
  getPublicIdFromUrl,
} from "../utils/uploadImageCloudinary.js";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
} from "../validations/subCategory.validation.js";

export const addSubCategoryController = async (req, res) => {
  try {
    const parsed = createSubCategorySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { category, image, name } = parsed.data;

    const subCategory = new SubCategoryModel({
      category,
      image,
      name,
    });

    const saved = await subCategory.save();

    return res.status(201).json({
      data: saved,
      error: false,
      message: "Tạo danh mục con thành công",
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

export const getSubCategoryController = async (_req, res) => {
  try {
    const subCategories = await SubCategoryModel.find()
      .sort({ createdAt: -1 })
      .populate("category");

    return res.json({
      data: subCategories,
      error: false,
      message: "Lấy danh sách danh mục con thành công",
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

export const updateSubCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID danh mục con",
        success: false,
      });
    }

    const parsed = updateSubCategorySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { category, image, name } = parsed.data;

    const existing = await SubCategoryModel.findById(_id);

    if (!existing) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy danh mục con",
        success: false,
      });
    }

    if (existing.image && existing.image !== image) {
      const publicId = getPublicIdFromUrl(existing.image);
      if (publicId) {
        await deleteImageCloudinary(publicId).catch(() => {});
      }
    }

    const updated = await SubCategoryModel.findByIdAndUpdate(
      _id,
      { category, image, name },
      { new: true },
    );

    return res.json({
      data: updated,
      error: false,
      message: "Cập nhật danh mục con thành công",
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

export const deleteSubCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ID danh mục con",
        success: false,
      });
    }

    const usedInProduct = await ProductModel.findOne({
      subCategory: { $in: [_id] },
    });

    if (usedInProduct) {
      return res.status(400).json({
        error: true,
        message: "Danh mục con đang được sử dụng trong sản phẩm, không thể xóa",
        success: false,
      });
    }

    const subCategory = await SubCategoryModel.findById(_id);

    if (!subCategory) {
      return res.status(404).json({
        error: true,
        message: "Không tìm thấy danh mục con",
        success: false,
      });
    }

    if (subCategory.image) {
      const publicId = getPublicIdFromUrl(subCategory.image);
      if (publicId) {
        await deleteImageCloudinary(publicId).catch(() => {});
      }
    }

    await SubCategoryModel.findByIdAndDelete(_id);

    return res.json({
      error: false,
      message: "Xóa danh mục con thành công",
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
