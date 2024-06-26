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
    const { searchParams } = new URL(req.nextUrl);
    // const status = Boolean(searchParams.get("status"));
    const status = searchParams.get("status") === "true";
    const Homeowners = await prisma.homes.findMany({
      where: {
        active: status,
      },
      include: {
        homeowner: true,
      },
    });
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find Home:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const {
      homeOwnerId,
      address,
      building,
      apartmentNo,
      Ward,
      District,
      Province,
      Note,
    } = await req.json();
    if (!homeOwnerId || !address) {
      throw new Error("Invalid address or homeOwnerId information");
    }

    const newHomeowner = await prisma.homes.create({
      data: {
        homeOwnerId: Number(homeOwnerId),
        address,
        apartmentNo,
        building,
        Ward,
        District,
        Province,
        Note,
        active: true,
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
    const {
      _homeId,
      homeOwnerId,
      active,
      address,
      building,
      apartmentNo,
      Ward,
      District,
      Province,
      Note,
    } = await req.json();

    if (!_homeId) {
      throw new Error("Invalid homeId information");
    }

    const home = await prisma.homes.update({
      where: { homeId: Number(_homeId) },
      data: {
        homeOwnerId: Number(homeOwnerId),
        address,
        apartmentNo,
        building,
        Ward,
        District,
        Province,
        Note,
        active: Boolean(active),
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
