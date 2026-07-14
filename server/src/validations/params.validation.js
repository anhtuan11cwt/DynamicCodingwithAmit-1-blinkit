import { z } from "zod";
import { objectIdSchema } from "../utils/objectId.js";

export const idParamSchema = z.object({
  id: objectIdSchema,
});
