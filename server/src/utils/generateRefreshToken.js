import "dotenv/config";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

if (!process.env.SECRET_KEY_REFRESH_TOKEN) {
  throw new Error("Vui lòng cung cấp SECRET_KEY_REFRESH_TOKEN trong file .env");
}

const generateRefreshToken = async (id) => {
  const refreshToken = jwt.sign({ id }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  await UserModel.updateOne({ _id: id }, { refresh_token: refreshToken });

  return refreshToken;
};

export default generateRefreshToken;
