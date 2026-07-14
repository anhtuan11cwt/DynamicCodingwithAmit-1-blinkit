import { z } from "zod";

const SPECIAL = `!@#$%^&*()_+=[]{};:'",.<>?/|~-`;

const escapeForClass = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const ALLOWED = new RegExp(`^[A-Za-z0-9${escapeForClass(SPECIAL)}]+$`);
const SPECIAL_LOOKAHEAD = new RegExp(`(?=.*[${escapeForClass(SPECIAL)}])`);

export const passwordSchema = z
  .string()
  .min(8, "Mật khẩu tối thiểu 8 ký tự")
  .max(64, "Mật khẩu tối đa 64 ký tự")
  .refine((v) => !/\s/.test(v), "Mật khẩu không được chứa khoảng trắng")
  .refine(
    (v) => ALLOWED.test(v),
    "Mật khẩu chỉ được chứa chữ, số và ký tự đặc biệt chuẩn, không dùng emoji/icon",
  )
  .regex(/(?=.*[a-z])/, "Phải chứa chữ thường")
  .regex(/(?=.*[A-Z])/, "Phải chứa chữ hoa")
  .regex(/(?=.*[0-9])/, "Phải chứa chữ số")
  .regex(SPECIAL_LOOKAHEAD, "Phải chứa ký tự đặc biệt");
