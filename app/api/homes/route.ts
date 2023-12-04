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
    const Homeowners = await prisma.homes.findMany();
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find Home:", error);
  } finally {
    await prisma.$disconnect();
  }

  // const allUsers = await prisma.homeowners.findMany();
  // console.dir(allUsers, { depth: null });
}

export async function POST(req: Request) {
  try {
    const { homeOwnerId, address, active } = await req.json();
    if (!homeOwnerId || !address) {
      throw new Error("Invalid address or homeOwnerId information");
    }

    const newHomeowner = await prisma.homes.create({
      data: {
        homeOwnerId,
        address,
        active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newHomeowner);
  } catch (error) {
    console.error("Error creating Home:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const { _homeId, _active, address, fullname } = await req.json();

    if (!_homeId) {
      throw new Error("Invalid homeId information");
    }

    const home = await prisma.homes.update({
      where: { homeId: Number(_homeId) },
      data: {
        address,
        fullname,
        active: Boolean(_active),
      },
    });

    return NextResponse.json({ home });
  } catch (error) {
    console.error("Error find Home:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
