import "dotenv/config";
import bcrypt from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

export const registerUserController = async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { name, email, password } = parsed.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "Email đã tồn tại",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      email,
      name,
      password: hashPassword,
    });

    await newUser.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;
    await sendEmail({
      html: verifyEmailTemplate({ name, url: verifyUrl }),
      sendTo: email,
      subject: "Xác thực Email của bạn",
    });

    return res.status(201).json({
      data: {
        email: newUser.email,
        id: newUser._id,
        name: newUser.name,
        verify_email: newUser.verify_email,
      },
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
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

export const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        error: true,
        message: "Mã không hợp lệ",
        success: false,
      });
    }

    const user = await UserModel.findById(code);
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Mã không hợp lệ",
        success: false,
      });
    }

    await UserModel.updateOne({ _id: code }, { verify_email: true });

    return res.json({
      data: {
        verify_email: true,
      },
      message: "Xác thực email thành công",
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

export const loginController = async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { email, password } = parsed.data;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "Email không tồn tại",
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        error: true,
        message: "Vui lòng liên hệ quản trị viên",
        success: false,
      });
    }

    if (!user.verify_email) {
      return res.status(400).json({
        error: true,
        message: "Vui lòng xác thực email trước khi đăng nhập",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: true,
        message: "Mật khẩu không đúng",
        success: false,
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      data: {
        email: user.email,
        id: user._id,
        name: user.name,
        role: user.role,
      },
      message: "Đăng nhập thành công",
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

export const logoutController = async (req, res) => {
  try {
    const userId = req.userId;

    await UserModel.findByIdAndUpdate(userId, { refresh_token: "" });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.json({
      message: "Đăng xuất thành công",
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
