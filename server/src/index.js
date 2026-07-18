import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import connectDB from "./config/connectDB.js";
import swaggerSpec from "./config/swagger.js";
import addressRouter from "./routes/address.route.js";
import authRouter from "./routes/auth.route.js";
import cartRouter from "./routes/cart.route.js";
import categoryRouter from "./routes/category.route.js";
import orderRouter from "./routes/order.route.js";
import paymentRouter from "./routes/payment.route.js";
import productRouter from "./routes/product.route.js";
import subCategoryRouter from "./routes/subCategory.route.js";
import uploadRouter from "./routes/upload.route.js";
import userRouter from "./routes/user.route.js";
import seedData from "./seed.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);

app.get("/", (_req, res) => {
  res.json({ message: "máy chủ đang chạy" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/address", addressRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/upload", uploadRouter);

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();
  await seedData();

  app.listen(PORT, () => {
    console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
    console.log(`Tài liệu API (Swagger) tại http://localhost:${PORT}/api-docs`);
  });
};

startServer();
