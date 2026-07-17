import express from "express";
import {
  addToCartItem,
  deleteCartItemQtyController,
  getCartItemController,
  updateCartItemQuantityController,
} from "../controllers/cart.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/cart/create:
 *   post:
 *     tags: [Cart]
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã thêm hoặc đã tồn tại trong giỏ hàng
 *       400:
 *         description: Thiếu mã sản phẩm
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", auth, addToCartItem);

/**
 * @openapi
 * /api/v1/cart/get:
 *   get:
 *     tags: [Cart]
 *     summary: Lấy danh sách giỏ hàng của người dùng
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get", auth, getCartItemController);

/**
 * @openapi
 * /api/v1/cart/update:
 *   put:
 *     tags: [Cart]
 *     summary: Cập nhật số lượng sản phẩm trong giỏ
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [_id, quantity]
 *             properties:
 *               _id:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cập nhật số lượng thành công
 *       400:
 *         description: Số lượng không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy mục giỏ hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/update", auth, updateCartItemQuantityController);

/**
 * @openapi
 * /api/v1/cart/delete:
 *   delete:
 *     tags: [Cart]
 *     summary: Xóa sản phẩm khỏi giỏ hàng
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
 *         description: Đã xóa sản phẩm khỏi giỏ hàng
 *       400:
 *         description: Thiếu mã mục giỏ hàng
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy mục giỏ hàng
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/delete", auth, deleteCartItemQtyController);

export default router;
