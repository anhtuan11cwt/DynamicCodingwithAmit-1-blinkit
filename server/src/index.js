import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

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

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${PORT}`);
});
