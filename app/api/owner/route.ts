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
    const Homeowners = await prisma.homeowners.findMany();
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error creating Home Contract:", error);
  } finally {
    await prisma.$disconnect();
  }

  // const allUsers = await prisma.homeowners.findMany();
  // console.dir(allUsers, { depth: null });
}

export async function POST(req: Request) {
  try {
    const { name, phone, cittizenId, active } = await req.json();
    if (!name || !phone || !cittizenId) {
      throw new Error("Invalid name, phone, or cittizenId information");
    }

    const newHomeowner = await prisma.homeowners.create({
      data: {
        name,
        phone,
        cittizenId,
        active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newHomeowner);
  } catch (error) {
    console.error("Error creating Home Contract:", error);
  } finally {
    await prisma.$disconnect();
  }
}
