import { z } from "zod";
import { objectIdSchema } from "../utils/objectId.js";

export const createCartSchema = z.object({
  productId: objectIdSchema,

  quantity: z.number().int().positive().max(1000),

  userId: objectIdSchema,
});

export const updateCartSchema = createCartSchema.partial();
