import "dotenv/config";
import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import uploadImageCloudinary, {
  deleteImageCloudinary,
  getPublicIdFromUrl,
} from "../utils/uploadImageCloudinary.js";
import { updateProfileSchema } from "../validations/user.validation.js";

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: true,
        message: "Thiếu ảnh đại diện",
        success: false,
      });
    }

    const existingUser = await UserModel.findById(req.userId);

    const uploadResult = await uploadImageCloudinary(file, "1-blinkit/avatar");
    const imageUrl = uploadResult.secure_url;

    const oldPublicId = getPublicIdFromUrl(existingUser?.avatar);
    if (oldPublicId) {
      await deleteImageCloudinary(oldPublicId).catch(() => {});
    }

    await UserModel.findByIdAndUpdate(req.userId, { avatar: imageUrl });

    return res.json({
      data: {
        avatar: imageUrl,
      },
      message: "Tải ảnh đại diện thành công",
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

export const updateUserDetails = async (req, res) => {
  try {
    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { name, email, mobile, password } = parsed.data;
    const userId = req.userId;

    if (email) {
      const existingUser = await UserModel.findOne({
        _id: { $ne: userId },
        email,
      });

      if (existingUser) {
        return res.status(409).json({
          error: true,
          message: "Email đã tồn tại",
          success: false,
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (mobile !== undefined) updateData.mobile = mobile;

    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      updateData.password = hashPassword;
    }

    await UserModel.updateOne({ _id: userId }, { $set: updateData });

    return res.json({
      message: "Cập nhật thông tin thành công",
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
