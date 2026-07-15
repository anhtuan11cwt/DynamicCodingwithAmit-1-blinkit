import { z } from "zod";

const noDoubleSpace = (value) => !/\s{2,}/.test(value);
const notAllDigits = (value) => !/^\d+$/.test(value);
const noRepeatedMarks = (value) => !/[-']{2,}/.test(value);
const noEdgeMarks = (value) => !/^[-']|[-']$/.test(value);
const noEmoji = (value) => !/\p{Extended_Pictographic}/u.test(value);

const buildNameSchema = ({ max = 100, pattern, label = "Tên", maxWords }) => {
  let schema = z
    .string()
    .trim()
    .min(2, `${label} phải có ít nhất 2 ký tự`)
    .max(max, `${label} tối đa ${max} ký tự`)
    .regex(
      pattern,
      `${label} chỉ được chứa chữ cái, khoảng trắng và một số ký tự cho phép`,
    )
    .refine(noDoubleSpace, "Không được có nhiều khoảng trắng liên tiếp")
    .refine(notAllDigits, `${label} không được chỉ chứa số`)
    .refine(noRepeatedMarks, `${label} không hợp lệ`)
    .refine(noEdgeMarks, `${label} không được bắt đầu hoặc kết thúc bằng dấu`)
    .refine(noEmoji, `${label} không được chứa emoji`);

  if (maxWords) {
    schema = schema.refine(
      (value) => value.split(/\s+/).length <= maxWords,
      `${label} không được quá ${maxWords} từ`,
    );
  }

  return schema;
};

export const personNameSchema = buildNameSchema({
  label: "Tên người",
  max: 50,
  maxWords: 10,
  pattern: /^[\p{L}\p{M}\s'-]+$/u,
});
