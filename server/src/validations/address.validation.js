import { z } from "zod";

export const createAddressSchema = z.object({
  address_line: z.string().trim().min(3).max(255),

  city: z.string().trim().min(2).max(100),

  mobile: z
    .string()
    .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0")
    .nullable()
    .optional(),

  pincode: z
    .string()
    .regex(/^\d{5,6}$/, "Mã bưu điện phải có 5-6 chữ số")
    .nullable()
    .optional(),

  state: z.string().trim().min(2).max(100),

  status: z.boolean().optional(),
});

export const updateAddressSchema = createAddressSchema.partial();
