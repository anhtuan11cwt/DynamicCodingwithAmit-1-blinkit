import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateOtp from "../utils/generateOtp.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from "../validations/auth.validation.js";

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

export const forgotPasswordController = async (req, res) => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { email } = parsed.data;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Email không tồn tại",
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000);

    await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_expiry: expireTime,
      forgot_password_otp: String(otp),
    });

    await sendEmail({
      html: forgotPasswordTemplate({ name: user.name, otp }),
      sendTo: email,
      subject: "Mã OTP quên mật khẩu",
    });

    return res.json({
      message: "Đã gửi mã OTP qua email",
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

export const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { email, otp } = parsed.data;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Email không tồn tại",
        success: false,
      });
    }

    if (new Date() > user.forgot_password_expiry) {
      return res.status(400).json({
        error: true,
        message: "Mã OTP đã hết hạn",
        success: false,
      });
    }

    if (String(otp) !== user.forgot_password_otp) {
      return res.status(400).json({
        error: true,
        message: "Mã OTP không đúng",
        success: false,
      });
    }

    return res.json({
      message: "Xác thực OTP thành công",
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

export const resetPassword = async (req, res) => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: true,
        message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ",
        success: false,
      });
    }

    const { email, newPassword } = parsed.data;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Email không tồn tại",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findOneAndUpdate(
      { email },
      {
        forgot_password_expiry: null,
        forgot_password_otp: null,
        password: hashPassword,
      },
    );

    return res.json({
      message: "Đặt lại mật khẩu thành công",
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

export const refreshToken = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Refresh token không tồn tại",
        success: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch {
      return res.status(401).json({
        error: true,
        message: "Refresh token không hợp lệ hoặc đã hết hạn",
        success: false,
      });
    }

    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "Email không tồn tại",
        success: false,
      });
    }

    if (user.refresh_token !== token) {
      return res.status(401).json({
        error: true,
        message: "Refresh token không hợp lệ",
        success: false,
      });
    }

    const accessToken = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.json({
      data: {
        accessToken,
      },
      message: "Cấp lại access token thành công",
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
