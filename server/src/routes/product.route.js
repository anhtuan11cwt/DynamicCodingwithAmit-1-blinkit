import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductByIdController,
  getProductController,
  updateProductController,
} from "../controllers/product.controller.js";
import admin from "../middleware/admin.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/product/create:
 *   post:
 *     tags: [Product]
 *     summary: Tạo sản phẩm mới
 *     description: |
 *       Tạo sản phẩm với các trường bắt buộc: `name`, `image` (mảng), `category` (mảng ID),
 *       `subCategory` (mảng ID), `unit`, `price`. Các trường tùy chọn: `description`,
 *       `discount`, `stock`, `more_details`. Yêu cầu quyền ADMIN.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, category, subCategory, unit, price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sữa tươi hữu cơ
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/product/milk.png"]
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6849a1b2c3d4e5f6a7b8c9d0"]
 *               subCategory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["6849a1b2c3d4e5f6a7b8c9d1"]
 *               unit:
 *                 type: string
 *                 example: lít
 *               price:
 *                 type: number
 *                 example: 45000
 *               stock:
 *                 type: number
 *                 example: 100
 *               discount:
 *                 type: number
 *                 example: 10
 *               description:
 *                 type: string
 *                 example: Sữa tươi hữu cơ nhập khẩu
 *               more_details:
 *                 type: object
 *                 example: {"Return Policy": "7 days", "Warranty": "12 months"}
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", auth, admin, createProductController);

/**
 * @openapi
 * /api/v1/product/update:
 *   put:
 *     tags: [Product]
 *     summary: Cập nhật sản phẩm
 *     description: |
 *       Cập nhật thông tin sản phẩm theo `_id`. Các trường không truyền sẽ giữ nguyên giá trị cũ.
 *       Nếu `image` thay đổi, ảnh cũ sẽ tự động xóa trên Cloudinary. Yêu cầu quyền ADMIN.
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
 *                 example: Sữa tươi hữu cơ
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               subCategory:
 *                 type: array
 *                 items:
 *                   type: string
 *               unit:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               discount:
 *                 type: number
 *               description:
 *                 type: string
 *               more_details:
 *                 type: object
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       400:
 *         description: Thiếu ID hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/update", auth, admin, updateProductController);

/**
 * @openapi
 * /api/v1/product/delete:
 *   delete:
 *     tags: [Product]
 *     summary: Xóa sản phẩm
 *     description: |
 *       Xóa sản phẩm theo `_id` và xóa tất cả ảnh liên quan trên Cloudinary.
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
 *         description: Xóa sản phẩm thành công
 *       400:
 *         description: Thiếu ID sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/delete", auth, admin, deleteProductController);

/**
 * @openapi
 * /api/v1/product/get:
 *   post:
 *     tags: [Product]
 *     summary: Lấy danh sách sản phẩm có phân trang và tìm kiếm
 *     description: |
 *       Trả về danh sách sản phẩm theo trang, kèm metadata phân trang.
 *       Hỗ trợ tìm kiếm toàn văn bản trên `name` và `description` thông qua `$text` của MongoDB.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: number
 *                 example: 1
 *               limit:
 *                 type: number
 *                 example: 10
 *               search:
 *                 type: string
 *                 example: sữa
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalCount:
 *                   type: number
 *                 totalPage:
 *                   type: number
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/get", getProductController);

/**
 * @openapi
 * /api/v1/product/getById:
 *   post:
 *     tags: [Product]
 *     summary: Lấy thông tin sản phẩm theo ID
 *     description: |
 *       Trả về chi tiết một sản phẩm dựa trên `_id`. Yêu cầu quyền ADMIN.
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
 *         description: Lấy sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: Thiếu ID sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/getById", auth, admin, getProductByIdController);

export default router;
