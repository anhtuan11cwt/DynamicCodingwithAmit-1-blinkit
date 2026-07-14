import { z } from "zod";
import { productNameSchema } from "../utils/name.js";
import { objectIdSchema } from "../utils/objectId.js";

export const createOrderSchema = z.object({
  delivery_address: objectIdSchema,

  invoice_receipt: z.string().url().max(2048).optional(),

  orderId: z.string().trim().min(3).max(50),

  payment_status: z.string().trim().min(1).max(50),

  paymentId: z.string().max(100).optional(),

  product_details: z.object({
    image: z.string().url().max(2048),
    name: productNameSchema,
  }),

  product_id: objectIdSchema,

  subTotalAmt: z.number().nonnegative().max(1e12),

  totalAmt: z.number().nonnegative().max(1e12),
  userId: objectIdSchema,
});

export const updateOrderSchema = createOrderSchema.partial();
