import { z } from "zod";
import { objectIdSchema } from "../utils/objectId.js";

export const addToCartSchema = z.object({
  productId: objectIdSchema,
});

export const getCartSchema = z.object({});

export const updateCartSchema = z.object({
  _id: objectIdSchema,
  quantity: z.coerce.number().int().positive().max(1000),
});

export const deleteCartSchema = z.object({
  _id: objectIdSchema,
});
