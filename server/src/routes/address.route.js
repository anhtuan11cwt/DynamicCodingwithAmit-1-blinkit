import express from "express";
import {
  addAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/address/create:
 *   post:
 *     tags: [Address]
 *     summary: Thêm địa chỉ giao hàng mới
 *     description: |
 *       Tạo một địa chỉ mới cho người dùng đang đăng nhập.
 *       Các trường bắt buộc: `address_line`, `city`, `state`.
 *       Các trường tùy chọn: `pincode`, `mobile`.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address_line, city, state]
 *             properties:
 *               address_line:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *                 example: "123 Đường ABC, Phường XYZ"
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Hồ Chí Minh"
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Quận 1"
 *               pincode:
 *                 type: string
 *                 pattern: "^\\d{5,6}$"
 *                 example: "700000"
 *               mobile:
 *                 type: string
 *                 pattern: "^0\\d{9}$"
 *                 example: "0912345678"
 *           example:
 *             address_line: "123 Đường ABC, Phường XYZ"
 *             city: "Hồ Chí Minh"
 *             state: "Quận 1"
 *             pincode: "700000"
 *             mobile: "0912345678"
 *     responses:
 *       201:
 *         description: Thêm địa chỉ thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Địa chỉ đã được thêm
 *               data:
 *                 _id: 6849a1b2c3d4e5f6a7b8c9d1
 *                 address_line: "123 Đường ABC, Phường XYZ"
 *                 city: "Hồ Chí Minh"
 *                 state: "Quận 1"
 *                 pincode: "700000"
 *                 mobile: "0912345678"
 *                 user_id: 6849a1b2c3d4e5f6a7b8c9d0
 *                 status: true
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/create", auth, addAddress);

/**
 * @openapi
 * /api/v1/address/get:
 *   get:
 *     tags: [Address]
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     description: |
 *       Trả về danh sách tất cả địa chỉ đang hoạt động (`status: true`)
 *       thuộc về người dùng đang đăng nhập.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách địa chỉ thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 - _id: 6849a1b2c3d4e5f6a7b8c9d1
 *                   address_line: "123 Đường ABC, Phường XYZ"
 *                   city: "Hồ Chí Minh"
 *                   state: "Quận 1"
 *                   pincode: "700000"
 *                   mobile: "0912345678"
 *                   user_id: 6849a1b2c3d4e5f6a7b8c9d0
 *                   status: true
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/get", auth, getAddress);

/**
 * @openapi
 * /api/v1/address/update/{id}:
 *   put:
 *     tags: [Address]
 *     summary: Cập nhật địa chỉ
 *     description: |
 *       Cập nhật thông tin địa chỉ theo `_id`.
 *       Chỉ người dùng sở hữu địa chỉ mới được phép cập nhật.
 *       Các trường gửi vào là tùy chọn; trường không gửi sẽ giữ nguyên giá trị cũ.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id của địa chỉ
 *         example: 6849a1b2c3d4e5f6a7b8c9d1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address_line:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               pincode:
 *                 type: string
 *                 pattern: "^\\d{5,6}$"
 *               mobile:
 *                 type: string
 *                 pattern: "^0\\d{9}$"
 *           example:
 *             city: "Quận 2"
 *             mobile: "0987654321"
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Địa chỉ đã được cập nhật
 *               data:
 *                 _id: 6849a1b2c3d4e5f6a7b8c9d1
 *                 address_line: "123 Đường ABC, Phường XYZ"
 *                 city: "Quận 2"
 *                 state: "Quận 1"
 *                 pincode: "700000"
 *                 mobile: "0987654321"
 *                 user_id: 6849a1b2c3d4e5f6a7b8c9d0
 *                 status: true
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Địa chỉ không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/update/:id", auth, updateAddress);

/**
 * @openapi
 * /api/v1/address/delete/{id}:
 *   delete:
 *     tags: [Address]
 *     summary: Xóa địa chỉ (soft delete)
 *     description: |
 *       Thực hiện xóa mềm địa chỉ bằng cách đổi `status` thành `false`.
 *       Địa chỉ sẽ không hiển thị trong danh sách nhưng vẫn được lưu trong database.
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB _id của địa chỉ
 *         example: 6849a1b2c3d4e5f6a7b8c9d1
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Địa chỉ đã được xóa
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Địa chỉ không tồn tại
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete("/delete/:id", auth, deleteAddress);

export default router;
