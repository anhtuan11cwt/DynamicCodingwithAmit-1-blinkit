import "dotenv/config";
import jwt from "jsonwebtoken";

if (!process.env.SECRET_KEY_ACCESS_TOKEN) {
  throw new Error("Vui lòng cung cấp SECRET_KEY_ACCESS_TOKEN trong file .env");
}

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: "5h",
  });
};

export default generateAccessToken;
