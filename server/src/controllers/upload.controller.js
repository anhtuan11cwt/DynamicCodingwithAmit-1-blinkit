import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const FOLDER_BY_TYPE = {
  avatar: "1-blinkit/avatar",
  banner: "1-blinkit/banner",
  category: "1-blinkit/category",
  product: "1-blinkit/product",
  subcategory: "1-blinkit/subcategory",
};

const DEFAULT_FOLDER = "1-blinkit";

export const uploadImageController = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: true,
        message: "Thiếu file ảnh",
        success: false,
      });
    }

    const folder = FOLDER_BY_TYPE[req.params.type] || DEFAULT_FOLDER;

    const uploadResult = await uploadImageCloudinary(file, folder);

    return res.json({
      data: {
        url: uploadResult.secure_url,
      },
      error: false,
      message: "Tải ảnh lên thành công",
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
