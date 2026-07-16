import express from "express";
import {
  addSubCategoryController,
  deleteSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
} from "../controllers/subCategory.controller.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/subcategory/add:
 *   post:
 *     tags: [SubCategory]
 *     summary: Thêm danh mục con
 *     description: |
 *       Tạo danh mục con với `name`, `image` và `category` (mảng ID danh mục cha).
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
 *             required: [name, image, category]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sữa tươi
 *               image:
 *                 type: string
 *                 example: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/subcategory/milk.png
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6849a1b2c3d4e5f6a7b8c9d0"]
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/add", auth, admin, addSubCategoryController);

/**
 * @openapi
 * /api/v1/subcategory/get:
 *   get:
 *     tags: [SubCategory]
 *     summary: Lấy danh sách danh mục con
 *     description: Trả về toàn bộ danh mục con (đã populate danh mục cha), sắp xếp mới nhất trước.
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get", getSubCategoryController);

/**
 * @openapi
 * /api/v1/subcategory/update:
 *   put:
 *     tags: [SubCategory]
 *     summary: Cập nhật danh mục con
 *     description: Cập nhật `name`, `image` hoặc `category` của danh mục con theo `_id`. Yêu cầu quyền ADMIN.
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
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Thiếu ID
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/update", auth, admin, updateSubCategoryController);

/**
 * @openapi
 * /api/v1/subcategory/delete:
 *   delete:
 *     tags: [SubCategory]
 *     summary: Xóa danh mục con
 *     description: |
 *       Xóa danh mục con theo `_id`. Yêu cầu quyền ADMIN.
 *       Trả về lỗi 400 nếu danh mục con đang được sử dụng trong sản phẩm.
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
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Đang được sử dụng hoặc thiếu ID
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/delete", auth, admin, deleteSubCategoryController);

export default router;
