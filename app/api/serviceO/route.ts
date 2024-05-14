import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function GET(req: NextRequest) {
  try {
    const service = await prisma.service.findMany();
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error read service:", error);
  } finally {
    await prisma.$disconnect();
  }
}
