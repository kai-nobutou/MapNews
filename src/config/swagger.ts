import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import { getMetadataArgsStorage } from "routing-controllers";
import "reflect-metadata";

dotenv.config();

const storage = getMetadataArgsStorage();

const swaggerSpec = routingControllersToSpec(
  storage,
  {
    routePrefix: process.env.API_PREFIX || "/api",
    controllers: [__dirname + "/../controllers/*.ts"],  // コントローラーを明示的に指定
  },
  {
    info: {
      title: process.env.SWAGGER_TITLE || "My API",
      version: process.env.SWAGGER_VERSION || "1.0.0",
      description: process.env.SWAGGER_DESCRIPTION || "A simple Express API",
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:3000",
      },
    ],
  }
);

export { swaggerUi, swaggerSpec };