import { z } from "zod";
import { productNameSchema } from "../utils/name.js";
import { objectIdSchema } from "../utils/objectId.js";

export const createProductSchema = z.object({
  category: z.array(objectIdSchema).min(1),

  description: z.string().trim().min(5).max(2000),

  discount: z.number().min(0).max(100).nullable().optional(),

  image: z
    .array(z.string().url().max(2048))
    .min(1, "Cần ít nhất một hình ảnh")
    .max(5, "Tối đa 5 hình ảnh"),

  more_details: z.record(z.any()).optional(),
  name: productNameSchema,

  price: z.number().positive().min(20000).max(100000000),

  publish: z.boolean().optional(),

  stock: z.number().int().min(0).max(1000000),

  subCategory: z.array(objectIdSchema).min(1),

  unit: z.enum([
    "Kg",
    "Gram",
    "Lít",
    "ml",
    "Hộp",
    "Chai",
    "Gói",
    "Túi",
    "Lon",
    "Cái",
    "Bịch",
    "Chục",
  ]),
});

export const updateProductSchema = createProductSchema.partial();

export const getProductSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(10),
  page: z.coerce.number().int().positive().default(1),
  search: z.string().max(100).optional(),
});

export const getProductByCategorySchema = z.object({
  id: objectIdSchema,
});
