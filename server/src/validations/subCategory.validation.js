import { z } from "zod";
import { subCategoryNameSchema } from "../utils/name.js";
import { objectIdSchema } from "../utils/objectId.js";

export const createSubCategorySchema = z.object({
  category: z
    .array(objectIdSchema)
    .min(1)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Trùng lặp id danh mục",
    }),

  image: z.string().url().max(2048),
  name: subCategoryNameSchema,
});

export const updateSubCategorySchema = createSubCategorySchema.partial();
