import express from "express";
import {
  addCategoryController,
  getCategoryController,
} from "../controllers/category.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/category/add-category:
 *   post:
 *     tags: [Category]
 *     summary: Thêm danh mục mới
 *     description: |
 *       Tạo một danh mục mới với `name` và `image` (URL ảnh đã upload lên Cloudinary).
 *       Yêu cầu người dùng đã đăng nhập.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sữa
 *               image:
 *                 type: string
 *                 example: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/milk.png
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               message: Tạo danh mục thành công
 *               success: true
 *               data:
 *                 _id: 6849a1b2c3d4e5f6a7b8c9d0
 *                 name: Sữa
 *                 image: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/milk.png
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Vui lòng cung cấp đầy đủ tên và hình ảnh danh mục
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
router.post("/add-category", auth, addCategoryController);

/**
 * @openapi
 * /api/v1/category/get:
 *   get:
 *     tags: [Category]
 *     summary: Lấy danh sách danh mục
 *     description: |
 *       Trả về toàn bộ danh mục, sắp xếp theo `createdAt` giảm dần
 *       (danh mục mới nhất hiển thị đầu tiên).
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               message: Lấy danh sách danh mục thành công
 *               success: true
 *               data:
 *                 - _id: 6849a1b2c3d4e5f6a7b8c9d0
 *                   name: Sữa
 *                   image: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/category/milk.png
 *                   createdAt: 2026-07-16T03:00:00.000Z
 *                   updatedAt: 2026-07-16T03:00:00.000Z
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Đã xảy ra lỗi
 *               success: false
 */
router.get("/get", getCategoryController);

export default router;
