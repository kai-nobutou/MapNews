import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { useExpressServer, useContainer as routingUseContainer } from "routing-controllers";
import { swaggerUi, swaggerSpec } from "./config/swagger";
import dotenv from "dotenv";
import { prisma } from "./config/prisma";

dotenv.config();
const app = express();
app.use(express.json());

// TypeDIとrouting-controllersの連携設定
routingUseContainer(Container);

// TypeDIとrouting-controllersの連携
useExpressServer(app, {
    routePrefix: process.env.API_PREFIX || "/api",
    controllers: [__dirname + "/controllers/*.ts"],
});

// Swagger設定
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Prismaクライアントの終了処理
app.get("/health", async (req, res) => {
  const now = await prisma.$queryRaw`SELECT NOW()`;
  res.json({ status: "ok", serverTime: now });
});

export default app;