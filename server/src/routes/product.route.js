import express from "express";
import {
  createProductController,
  getProductController,
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

export default router;
