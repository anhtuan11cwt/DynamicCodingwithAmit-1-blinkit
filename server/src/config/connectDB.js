import "dotenv/config";
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Vui lòng cung cấp MONGODB_URI trong file .env");
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Đã kết nối MongoDB: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("Lỗi kết nối MongoDB");
    console.error(error);

    process.exit(1);
  }
};

export default connectDB;
