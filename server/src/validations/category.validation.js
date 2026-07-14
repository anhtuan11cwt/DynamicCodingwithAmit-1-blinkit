import { z } from "zod";
import { categoryNameSchema } from "../utils/name.js";

export const createCategorySchema = z.object({
  image: z.string().url().max(2048),
  name: categoryNameSchema,
});

export const updateCategorySchema = createCategorySchema.partial();
