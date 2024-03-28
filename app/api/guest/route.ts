import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const Homeowners = await prisma.guests.findMany();
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find Guest:", error);
  } finally {
    await prisma.$disconnect();
  }

  // const allUsers = await prisma.homeowners.findMany();
  // console.dir(allUsers, { depth: null });
}

export async function POST(req: Request) {
  try {
    const { fullname, phone, citizenId } = await req.json();
    if (!fullname || !phone || !citizenId) {
      throw new Error("Invalid name, phone, or citizenId information");
    }

    const newHomeowner = await prisma.guests.create({
      data: {
        phone,
        name: fullname,
        fullname,
        citizenId: citizenId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newHomeowner);
  } catch (error) {
    console.error("Error creating Guest:", error);
  } finally {
    await prisma.$disconnect();
  }
}
