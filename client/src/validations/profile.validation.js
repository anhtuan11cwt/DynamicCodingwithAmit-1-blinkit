import { z } from "zod";
import { personNameSchema } from "./name";

export const mobileSchema = z
  .string()
  .trim()
  .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0")
  .nullable()
  .optional();

export const profileUpdateSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ").max(254).toLowerCase(),
  mobile: mobileSchema,
  name: personNameSchema,
});

export default profileUpdateSchema;
