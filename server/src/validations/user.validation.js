import { z } from "zod";
import { personNameSchema } from "../utils/name.js";
import { objectIdSchema } from "../utils/objectId.js";
import { passwordSchema } from "../utils/password.js";

export const createUserSchema = z.object({
  address_details: z.array(objectIdSchema).optional(),

  avatar: z.string().url().max(2048).optional(),

  email: z.string().trim().email().max(254).toLowerCase(),

  forgot_password_expiry: z.coerce.date().nullable().optional(),

  forgot_password_otp: z
    .string()
    .regex(/^\d{6}$/, "OTP phải gồm 6 chữ số")
    .nullable()
    .optional(),

  last_login_date: z.coerce.date().optional(),

  mobile: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0")
    .nullable()
    .optional(),
  name: personNameSchema,

  order_history: z.array(objectIdSchema).optional(),

  password: passwordSchema,

  refresh_token: z.string().max(1024).optional(),

  role: z.enum(["ADMIN", "USER"]),

  shopping_cart: z.array(objectIdSchema).optional(),

  status: z.enum(["Active", "Inactive", "Suspended"]),

  verify_email: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const updateProfileSchema = z.object({
  email: z.string().trim().email().max(254).toLowerCase().optional(),
  mobile: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0")
    .nullable()
    .optional(),
  name: personNameSchema.optional(),
  password: passwordSchema.optional(),
});
