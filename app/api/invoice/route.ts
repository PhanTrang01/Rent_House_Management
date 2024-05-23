import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const Homeowners = await prisma.invoicesPayment.findMany();
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find invoicesPayment:", error);
  } finally {
    await prisma.$disconnect();
  }
}
