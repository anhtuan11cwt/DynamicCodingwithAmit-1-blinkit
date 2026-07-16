import SubCategoryModel from "../models/subCategory.model.js";

export const addSubCategoryController = async (req, res) => {
  try {
    const { category, image, name } = req.body;

    if (!name || !image || !category || category.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Vui lòng cung cấp đầy đủ tên, hình ảnh và danh mục cha",
        success: false,
      });
    }

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
