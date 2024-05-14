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
    const receiver = await prisma.receiver.findMany();
    return NextResponse.json(receiver);
  } catch (error) {
    console.error("Error read receiver:", error);
  } finally {
    await prisma.$disconnect();
  }
}
