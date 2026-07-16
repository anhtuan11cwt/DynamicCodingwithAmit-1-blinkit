import express from "express";
import {
  addCategoryController,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
} from "../controllers/category.controller.js";
import admin from "../middleware/admin.js";
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
router.post("/add-category", auth, admin, addCategoryController);

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

/**
 * @openapi
 * /api/v1/category/update:
 *   put:
 *     tags: [Category]
 *     summary: Cập nhật danh mục
 *     description: Cập nhật `name` và/hoặc `image` của danh mục theo `_id`. Yêu cầu quyền ADMIN.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [_id]
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 6849a1b2c3d4e5f6a7b8c9d0
 *               name:
 *                 type: string
 *                 example: Sữa tươi
 *               image:
 *                 type: string
 *                 example: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/category/milk.png
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               message: Cập nhật danh mục thành công
 *               success: true
 *       400:
 *         description: Thiếu ID danh mục
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/update", auth, admin, updateCategoryController);

/**
 * @openapi
 * /api/v1/category/delete:
 *   delete:
 *     tags: [Category]
 *     summary: Xóa danh mục
 *     description: |
 *       Xóa danh mục theo `_id`. Nếu danh mục đang được tham chiếu bởi
 *       danh mục con (SubCategory) hoặc sản phẩm (Product) thì không cho phép xóa.
 *       Yêu cầu quyền ADMIN.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [_id]
 *             properties:
 *               _id:
 *                 type: string
 *                 example: 6849a1b2c3d4e5f6a7b8c9d0
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               message: Xóa danh mục thành công
 *               success: true
 *       400:
 *         description: Thiếu ID hoặc danh mục đang được sử dụng
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Danh mục đang được sử dụng, không thể xóa
 *               success: false
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/delete", auth, admin, deleteCategoryController);

export default router;
