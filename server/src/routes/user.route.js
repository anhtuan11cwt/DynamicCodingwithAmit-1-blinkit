import express from "express";
import {
  updateUserDetails,
  uploadAvatar,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/users/upload-avatar:
 *   put:
 *     tags: [Users]
 *     summary: Tải ảnh đại diện lên Cloudinary
 *     description: |
 *       Nhận file ảnh (field `avatar`) qua multipart/form-data, upload lên Cloudinary
 *       (thư mục `1-blinkit/avatar`) và lưu URL vào trường `avatar` của user.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh đại diện
 *     responses:
 *       200:
 *         description: Tải ảnh thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Tải ảnh đại diện thành công
 *               success: true
 *               data:
 *                 avatar: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/abc.jpg
 *       400:
 *         description: Thiếu file ảnh
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Avatar required
 *               success: false
 *       401:
 *         description: Chưa xác thực
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Token không hợp lệ
 *               success: false
 *       500:
 *         description: Lỗi máy chủ (ví dụ upload Cloudinary thất bại)
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Đã xảy ra lỗi
 *               success: false
 */
router.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);

/**
 * @openapi
 * /api/v1/users/update-user:
 *   patch:
 *     tags: [Users]
 *     summary: Cập nhật thông tin cá nhân
 *     description: |
 *       Cập nhật name, email, mobile và/hoặc password của user đang đăng nhập.
 *       Nếu cung cấp `password`, mật khẩu sẽ được băm lại bằng bcrypt.
 *       Email mới không được trùng với user khác.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyen Van A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: nguyenvana@gmail.com
 *               mobile:
 *                 type: string
 *                 example: "0987654321"
 *               password:
 *                 type: string
 *                 description: "8-64 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
 *                 example: Matkhau@123
 *           example:
 *             name: Nguyen Van A
 *             email: nguyenvana@gmail.com
 *             mobile: "0987654321"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Cập nhật thông tin thành công
 *               success: true
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Mật khẩu tối thiểu 8 ký tự"
 *               success: false
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Email đã tồn tại
 *               success: false
 *       401:
 *         description: Chưa xác thực
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
router.patch("/update-user", auth, updateUserDetails);

export default router;
