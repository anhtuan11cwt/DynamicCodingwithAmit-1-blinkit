import "dotenv/config";
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  apis: ["./src/routes/*.js"],
  definition: {
    components: {
      securitySchemes: {
        bearerAuth: {
          bearerFormat: "JWT",
          scheme: "bearer",
          type: "http",
        },
        cookieAuth: {
          in: "cookie",
          name: "accessToken",
          type: "apiKey",
        },
      },
    },
    info: {
      description:
        "API xác thực người dùng: đăng ký, xác thực email, đăng nhập (JWT) và đăng xuất.",
      title: "Blinkit API",
      version: "1.0.0",
    },
    openapi: "3.0.0",
    security: [{ cookieAuth: [] }, { bearerAuth: [] }],
    servers: [
      {
        description: "Local development",
        url: `http://localhost:${process.env.PORT || 8080}`,
      },
    ],
  },
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
