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

export async function POST(req: Request) {
  try {
    const { name, unit, description } = await req.json();
    if (!name) {
      throw new Error("Invalid name, phone, or citizenId information");
    }

    const newHomeowner = await prisma.service.create({
      data: {
        name,
        unit,
        description,
      },
    });
    return NextResponse.json(newHomeowner);
  } catch (error) {
    console.error("Error creating Guest:", error);
  } finally {
    await prisma.$disconnect();
  }
}
