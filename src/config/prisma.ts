import { PrismaClient } from "@prisma/client";

// Prismaクライアントのインスタンスを作成
export const prisma = new PrismaClient();

// Prismaの終了処理（アプリ終了時に接続を切る）
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    console.log("Prisma disconnected.");
    process.exit(0);
});