import "dotenv/config";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        error: true,
        message: "Token không hợp lệ",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decoded?.id) {
      return res.status(401).json({
        error: true,
        message: "Token không hợp lệ",
        success: false,
      });
    }

    req.userId = decoded.id;

    next();
  } catch {
    return res.status(401).json({
      error: true,
      message: "Token không hợp lệ",
      success: false,
    });
  }
};

export default auth;
