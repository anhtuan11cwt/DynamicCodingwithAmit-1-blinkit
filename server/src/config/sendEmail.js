import "dotenv/config";
import nodemailer from "nodemailer";

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error(
    "Vui lòng cung cấp EMAIL_USER và EMAIL_PASSWORD trong file .env",
  );
}

const transporter = nodemailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL_USER,
  },
  service: "gmail",
});

const sendEmail = async ({ sendTo, subject, html }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    html,
    subject,
    to: sendTo,
  });

  return info;
};

export default sendEmail;
