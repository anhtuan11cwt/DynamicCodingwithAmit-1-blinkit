import { z } from "zod";
import { passwordSchema } from "../utils/password.js";

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

export const resetPasswordSchema = z.object({
  email: z.string().email().max(254),
  otp: z.string().regex(/^\d{6}$/, "OTP phải gồm 6 chữ số"),
  password: passwordSchema,
});
