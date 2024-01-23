import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function GET() {
  try {
    const newHomeowner = await prisma.homeowners.create({
      data: {
        fullName: "Alice",
        phone: "0123456",
        createdAt: new Date(), // Đảm bảo rằng bạn cung cấp dữ liệu cho createdAt và updatedAt
        updatedAt: new Date(),
      },
    });
    console.log("New Home Contract:", newHomeowner);
  } catch (error) {
    console.error("Error creating Home Contract:", error);
  } finally {
    await prisma.$disconnect();
  }

  // const allUsers = await prisma.homeowners.findMany();
  // console.dir(allUsers, { depth: null });
  return NextResponse.json({ id: "123" });
}
