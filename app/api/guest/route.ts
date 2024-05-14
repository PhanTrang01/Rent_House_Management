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
    const {
      fullname,
      phone,
      citizenId,
      cittizen_ngaycap,
      cittizen_noicap,
      birthday,
      email,
      Note,
    } = await req.json();
    if (
      !fullname ||
      !phone ||
      !citizenId ||
      !cittizen_ngaycap ||
      !cittizen_noicap
    ) {
      throw new Error("Invalid name, phone, or citizenId information");
    }

    const newHomeowner = await prisma.guests.create({
      data: {
        phone,
        fullname,
        citizenId: citizenId,
        cittizen_ngaycap,
        cittizen_noicap,
        birthday,
        email,
        Note,
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
