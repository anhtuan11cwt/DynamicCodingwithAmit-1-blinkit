import CategoryModel from "../models/category.model.js";

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
