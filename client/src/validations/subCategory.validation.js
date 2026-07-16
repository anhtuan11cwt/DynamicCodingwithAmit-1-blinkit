import { z } from "zod";
import { subCategoryNameSchema } from "./name";
import { objectIdSchema } from "./params.validation";

export const subCategorySchema = z.object({
  category: z
    .array(objectIdSchema)
    .min(1)
    .refine((arr) => new Set(arr).size === arr.length, {
      message: "Trùng lặp id danh mục",
    }),
  image: z.string().url().max(2048),
  name: subCategoryNameSchema,
});
