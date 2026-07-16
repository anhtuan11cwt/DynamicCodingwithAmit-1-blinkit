import ProductModel from "../models/product.model.js";
import {
  createProductSchema,
  getProductSchema,
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
