import { z } from "zod";
import { objectIdSchema } from "../utils/objectId.js";

export const cashOnDeliverySchema = z.object({
  addressId: objectIdSchema,
  list_items: z
    .array(
      z.object({
        _id: objectIdSchema,
        image: z.array(z.string().url()).max(10).optional(),
        name: z.string().trim().min(1).max(100),
        productId: objectIdSchema,
        quantity: z.number().int().positive().max(1000).optional(),
      }),
    )
    .min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
  subTotalAmt: z.number().nonnegative().max(1e12),
  totalAmt: z.number().nonnegative().max(1e12),
});

export const createOrderSchema = z.object({
  delivery_address: objectIdSchema,
  invoice_receipt: z.string().url().max(2048).optional(),
  orderId: z.string().trim().min(3).max(50),
  payment_status: z.string().trim().min(1).max(50),
  paymentId: z.string().max(100).optional(),
  product_details: z.object({
    image: z.string().url().max(2048),
    name: z.string().trim().min(1).max(100),
  }),
  product_id: objectIdSchema,
  subTotalAmt: z.number().nonnegative().max(1e12),
  totalAmt: z.number().nonnegative().max(1e12),
  userId: objectIdSchema,
});

export const updateOrderSchema = createOrderSchema.partial();
