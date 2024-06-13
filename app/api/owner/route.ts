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
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }

  // const allUsers = await prisma.homeowners.findMany();
  // console.dir(allUsers, { depth: null });
}

export async function POST(req: Request) {
  try {
    const {
      name,
      phone,
      email,
      citizenId,
      citizen_ngaycap,
      citizen_noicap,
      birthday,
      STK,
      TenTK,
      bank,
    } = await req.json();
    if (
      !name ||
      !phone ||
      !email ||
      !birthday ||
      !citizenId ||
      !citizen_ngaycap ||
      !citizen_noicap
    ) {
      throw new Error("Invalid name, phone, or citizenId information");
    }

    const newHomeowner = await prisma.homeowners.create({
      data: {
        fullname: name,
        phone,
        email,
        citizenId,
        citizen_ngaycap,
        citizen_noicap,
        birthday,
        STK,
        TenTK,
        bank,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newHomeowner);
  } catch (error) {
    console.error("Error creating Home Owner:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json(); // Đọc dữ liệu từ req.

    const {
      homeOwnerId,
      name,
      phone,
      email,
      citizenId,
      citizen_ngaycap,
      citizen_noicap,
      birthday,
      STK,
      TenTK,
      bank,
      Note,
    } = body;

    if (!homeOwnerId) {
      throw new Error("Missing homeowner ID");
    }

    const updatedHomeowner = await prisma.homeowners.update({
      where: { homeOwnerId: homeOwnerId },
      data: {
        fullname: name,
        phone,
        email,
        citizenId,
        citizen_ngaycap,
        citizen_noicap,
        birthday,
        STK,
        TenTK,
        bank,
        Note,
        active: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedHomeowner);
  } catch (error) {
    console.error("Error updating Home Owner:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { homeownerId } = await req.json();

    if (!homeownerId) return NextResponse.json({ deleted: false });
    const deletedHomeowner = await prisma.homeowners.delete({
      where: { homeOwnerId: parseInt(homeownerId as string, 10) },
    });
    return NextResponse.json(deletedHomeowner);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
