import UserModel from "../models/user.model.js";

const admin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId).select("role");

    if (user?.role !== "ADMIN") {
      return res.status(403).json({
        error: true,
        message: "Bạn không có quyền thực hiện thao tác này",
        success: false,
      });
    }

    next();
  } catch {
    return res.status(500).json({
      error: true,
      message: "Đã xảy ra lỗi khi kiểm tra quyền",
      success: false,
    });
  }
};

export default admin;
