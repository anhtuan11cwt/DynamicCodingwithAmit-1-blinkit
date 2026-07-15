import { z } from "zod";
import { personNameSchema } from "./name";
import { passwordSchema } from "./password";

export const emailSchema = z
  .string()
  .trim()
  .email("Email không hợp lệ")
  .max(254, "Email tối đa 254 ký tự")
  .toLowerCase();

export const fieldSchemas = {
  confirmPassword: passwordSchema,
  email: emailSchema,
  name: personNameSchema,
  newPassword: passwordSchema,
  password: passwordSchema,
};

export const registerSchema = z
  .object({
    confirmPassword: passwordSchema,
    email: emailSchema,
    name: personNameSchema,
    password: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const resetPasswordSchema = z
  .object({
    confirmPassword: passwordSchema,
    email: emailSchema,
    newPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
