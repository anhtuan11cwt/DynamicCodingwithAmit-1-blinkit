import { z } from "zod";
import { categoryNameSchema } from "./name";

export const categorySchema = z.object({
  image: z.string().url().max(2048),
  name: categoryNameSchema,
});
