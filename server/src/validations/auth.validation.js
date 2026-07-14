import { z } from "zod";
import { personNameSchema } from "../utils/name.js";
import { passwordSchema } from "../utils/password.js";

export const registerSchema = z.object({
  email: z.string().trim().email().max(254).toLowerCase(),
  name: personNameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export const verifyOtpSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/, "OTP phải gồm 6 chữ số"),
});

export const resetPasswordSchema = z
  .object({
    confirmPassword: passwordSchema,
    email: z.string().email().max(254),
    newPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });
