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
    const { name, phone, citizenId, active } = await req.json();
    if (!name || !phone || !citizenId) {
      throw new Error("Invalid name, phone, or citizenId information");
    }

    const newHomeowner = await prisma.homeowners.create({
      data: {
        fullName: name,
        phone,
        citizenId,
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
