import express from "express";
import { paymentController } from "../controllers/payment.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/payment/checkout:
 *   post:
 *     tags: [Payment]
 *     summary: Tạo Stripe Checkout Session
 *     description: |
 *       Tạo phiên thanh toán Stripe cho giỏ hàng của người dùng.
 *       Trả về `sessionId` để frontend chuyển hướng sang Stripe Checkout.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [addressId]
 *             properties:
 *               addressId:
 *                 type: string
 *                 description: MongoDB _id của địa chỉ giao hàng
 *                 example: 6849a1b2c3d4e5f6a7b8c9d2
 *     responses:
 *       200:
 *         description: Tạo session thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               sessionId: cs_test_1234567890
 *       400:
 *         description: Thiếu địa chỉ hoặc giỏ hàng trống
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy người dùng hoặc địa chỉ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/checkout", auth, paymentController);

export default router;
