import { z } from "zod";
import { productNameSchema } from "./name";
import { objectIdSchema } from "./params.validation";

export const productSchema = z.object({
  category: z
    .array(objectIdSchema)
    .min(1, "Vui lòng chọn ít nhất một danh mục"),
  description: z
    .string()
    .trim()
    .min(5, "Mô tả phải có ít nhất 5 ký tự")
    .max(2000, "Mô tả tối đa 2000 ký tự"),
  discount: z
    .number()
    .min(0, "Giảm giá không được âm")
    .max(100, "Giảm giá tối đa 100%")
    .nullable()
    .optional(),
  image: z
    .array(z.string().url().max(2048))
    .min(1, "Cần ít nhất một hình ảnh")
    .max(5, "Tối đa 5 hình ảnh"),
  more_details: z.record(z.any()).optional(),
  name: productNameSchema,
  price: z
    .number({ invalid_type_error: "Giá phải là số" })
    .positive("Giá phải lớn hơn 0")
    .min(20000, "Giá tối thiểu 20.000đ")
    .max(100000000, "Giá tối đa 100.000.000đ"),
  publish: z.boolean().optional(),
  stock: z
    .number({ invalid_type_error: "Tồn kho phải là số" })
    .int("Tồn kho phải là số nguyên")
    .min(0, "Tồn kho không được âm")
    .max(1000000, "Tồn kho tối đa 1.000.000"),
  subCategory: z
    .array(objectIdSchema)
    .min(1, "Vui lòng chọn ít nhất một danh mục con"),
  unit: z.enum(
    [
      "Kg",
      "Gram",
      "Lít",
      "ml",
      "Hộp",
      "Chai",
      "Gói",
      "Túi",
      "Lon",
      "Cái",
      "Bịch",
      "Chục",
    ],
    { errorMap: () => ({ message: "Vui lòng chọn đơn vị" }) },
  ),
});
