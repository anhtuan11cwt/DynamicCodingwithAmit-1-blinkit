import express from "express";
import {
  loginController,
  logoutController,
  registerUserController,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký người dùng mới
 *     description: |
 *       Tạo tài khoản mới, mã hóa mật khẩu bằng bcryptjs (salt 10) và gửi email
 *       xác thực qua Gmail (nodemailer). Validation theo `registerSchema`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên người dùng (2-50 ký tự, chỉ chữ cái, khoảng trắng và dấu ' -)
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvana@gmail.com
 *               password:
 *                 type: string
 *                 description: "8-64 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt (!@#$%^&*...)"
 *                 example: Matkhau@123
 *           example:
 *             name: Nguyen Van A
 *             email: nguyenvana@gmail.com
 *             password: Matkhau@123
 *     responses:
 *       201:
 *         description: Đăng ký thành công (email xác thực đã được gửi)
 *         content:
 *           application/json:
 *             example:
 *               message: Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.
 *               success: true
 *               data:
 *                 id: 6849a1b2c3d4e5f6a7b8c9d0
 *                 name: Nguyen Van A
 *                 email: nguyenvana@gmail.com
 *                 verify_email: false
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã tồn tại
 *         content:
 *           application/json:
 *             examples:
 *               invalid:
 *                 summary: Thiếu/ sai định dạng
 *                 value:
 *                   error: true
 *                   message: "Mật khẩu tối thiểu 8 ký tự"
 *                   success: false
 *               exists:
 *                 summary: Email đã tồn tại
 *                 value:
 *                   error: true
 *                   message: Email đã tồn tại
 *                   success: false
 *       500:
 *         description: Lỗi máy chủ (ví dụ gửi email thất bại)
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Lỗi gửi email xác thực
 *               success: false
 */
router.post("/register", registerUserController);

/**
 * @openapi
 * /api/v1/auth/verify-email:
 *   post:
 *     tags: [Auth]
 *     summary: Xác thực email
 *     description: |
 *       Nhận mã (`user._id`) từ link xác thực, cập nhật `verify_email = true`.
 *       Validation: `code` phải là Mongo ObjectId hợp lệ.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code]
 *             properties:
 *               code:
 *                 type: string
 *                 description: Mongo ObjectId của người dùng (lấy từ link xác thực)
 *                 example: 6849a1b2c3d4e5f6a7b8c9d0
 *           example:
 *             code: 6849a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Xác thực email thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Xác thực email thành công
 *               success: true
 *               data:
 *                 verify_email: true
 *       400:
 *         description: Mã không hợp lệ hoặc không tìm thấy user
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Mã không hợp lệ
 *               success: false
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Đã xảy ra lỗi
 *               success: false
 */
router.post("/verify-email", verifyEmailController);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập
 *     description: |
 *       Xác thực email/mật khẩu, kiểm tra `status = Active` và `verify_email = true`,
 *       sau đó trả accessToken (5h) và refreshToken (7d) qua cookie httpOnly.
 *       Validation theo `loginSchema`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvana@gmail.com
 *               password:
 *                 type: string
 *                 example: Matkhau@123
 *           example:
 *             email: nguyenvana@gmail.com
 *             password: Matkhau@123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         headers:
 *           Set-Cookie:
 *             description: accessToken và refreshToken (httpOnly, secure, sameSite=None)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             example:
 *               message: Đăng nhập thành công
 *               success: true
 *               data:
 *                 id: 6849a1b2c3d4e5f6a7b8c9d0
 *                 name: Nguyen Van A
 *                 email: nguyenvana@gmail.com
 *                 role: USER
 *       400:
 *         description: Sai thông tin, tài khoản bị khóa hoặc chưa xác thực email
 *         content:
 *           application/json:
 *             examples:
 *               notfound:
 *                 summary: Email không tồn tại
 *                 value:
 *                   error: true
 *                   message: Email không tồn tại
 *                   success: false
 *               wrongpass:
 *                 summary: Sai mật khẩu
 *                 value:
 *                   error: true
 *                   message: Mật khẩu không đúng
 *                   success: false
 *               notactive:
 *                 summary: Tài khoản không Active
 *                 value:
 *                   error: true
 *                   message: Vui lòng liên hệ quản trị viên
 *                   success: false
 *               notverified:
 *                 summary: Chưa xác thực email
 *                 value:
 *                   error: true
 *                   message: Vui lòng xác thực email trước khi đăng nhập
 *                   success: false
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Đã xảy ra lỗi
 *               success: false
 */
router.post("/login", loginController);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất
 *     description: |
 *       Yêu cầu accessToken (cookie `accessToken` hoặc header `Authorization: Bearer <token>`).
 *       Xóa cookie và vô hiệu hóa `refresh_token` trong database.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Đăng xuất thành công
 *               success: true
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Token không hợp lệ
 *               success: false
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Đã xảy ra lỗi
 *               success: false
 */
router.post("/logout", auth, logoutController);

export default router;
