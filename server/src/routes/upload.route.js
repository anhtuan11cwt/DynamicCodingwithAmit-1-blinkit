import express from "express";
import { uploadImageController } from "../controllers/upload.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/upload/image/{type}:
 *   post:
 *     tags: [Upload]
 *     summary: Tải một ảnh lên Cloudinary (folder do backend quyết định theo type)
 *     description: |
 *       Nhận file ảnh (field `image`) qua multipart/form-data, upload lên Cloudinary
 *       và trả về URL ảnh. Folder được backend map cố định theo `type`
 *       (category, product, subcategory, banner, avatar); type không hợp lệ dùng
 *       folder mặc định `1-blinkit`. Frontend KHÔNG thể tự chỉ định folder.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [category, product, subcategory, banner, avatar]
 *         description: Loại ảnh, backend map sang folder Cloudinary tương ứng
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: File ảnh cần tải lên
 *     responses:
 *       200:
 *         description: Tải ảnh thành công
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               message: Tải ảnh lên thành công
 *               success: true
 *               data:
 *                 url: https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/category/abc.jpg
 *       400:
 *         description: Thiếu file ảnh
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: Thiếu file ảnh
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
router.post("/image", auth, upload.single("image"), uploadImageController);
router.post(
  "/image/:type",
  auth,
  upload.single("image"),
  uploadImageController,
);

export default router;
