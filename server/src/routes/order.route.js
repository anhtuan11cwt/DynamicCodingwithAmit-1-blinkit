import express from "express";
import { cashOnDeliveryOrderController } from "../controllers/order.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/order/cash-on-delivery:
 *   post:
 *     tags: [Order]
 *     summary: Tạo đơn hàng COD (Cash on Delivery)
 *     description: |
 *       Tạo đơn hàng mới bằng phương thức thanh toán khi nhận hàng.
 *       Backend sẽ sinh `orderId`, lưu từng sản phẩm vào bộ sưu tập `order`,
 *       sau đó xóa các sản phẩm đã mua khỏi giỏ hàng của người dùng.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [list_items, addressId, subTotalAmt, totalAmt]
 *             properties:
 *               list_items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required: [_id, productId, name]
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: MongoDB _id của cart item
 *                     productId:
 *                       type: string
 *                       description: MongoDB _id của sản phẩm
 *                     name:
 *                       type: string
 *                       example: "Bàn chải đánh răng trẻ em Chicco"
 *                     image:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: uri
 *                       maxItems: 10
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       maximum: 1000
 *               addressId:
 *                 type: string
 *                 description: MongoDB _id của địa chỉ giao hàng
 *                 example: 6849a1b2c3d4e5f6a7b8c9d2
 *               subTotalAmt:
 *                 type: number
 *                 minimum: 0
 *                 example: 11802600
 *               totalAmt:
 *                 type: number
 *                 minimum: 0
 *                 example: 11802600
 *           example:
 *             list_items:
 *               - _id: 6849a1b2c3d4e5f6a7b8c9d3
 *                 productId: 6849a1b2c3d4e5f6a7b8c9d4
 *                 name: "Bàn chải đánh răng trẻ em Chicco (Xanh dương)"
 *                 image:
 *                   - "https://res.cloudinary.com/xxxx/image/upload/v1/1-blinkit/product1.jpg"
 *                 quantity: 1
 *             addressId: 6849a1b2c3d4e5f6a7b8c9d2
 *             subTotalAmt: 11802600
 *             totalAmt: 11802600
 *     responses:
 *       201:
 *         description: Tạo đơn hàng COD thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Đặt hàng thành công
 *               data:
 *                 orderId: 6849a1b2c3d4e5f6a7b8c9d5
 *                 order_count: 2
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy người dùng hoặc địa chỉ
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/cash-on-delivery", auth, cashOnDeliveryOrderController);

export default router;
