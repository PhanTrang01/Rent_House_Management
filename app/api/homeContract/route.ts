import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, StatusContract } from "@prisma/client";
import { type } from "os";
import { useState } from "react";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const searchKey = searchParams.get("q") ?? " ";
    const guestId = searchParams.get("guestId") ?? " ";
    const homeId = searchParams.get("homeId") ?? " ";

    let whereClause = {};

    // If no parameters are provided, return all contracts
    if (!searchKey.trim() && !guestId.trim() && !homeId.trim()) {
      whereClause = {};
    }
    // If only homeId is provided
    else if (homeId && !searchKey.trim() && !guestId.trim()) {
      whereClause = {
        home: {
          homeId: Number(homeId),
        },
      };
    }
    // If only guestId is provided
    else if (guestId && !searchKey.trim() && !homeId.trim()) {
      whereClause = {
        guest: {
          guestId: Number(guestId),
        },
      };
    }
    // If other combinations of search parameters are provided
    else {
      whereClause = {
        OR: [
          {
            guest: {
              OR: [
                {
                  fullname: {
                    contains: String(searchKey),
                  },
                },
                {
                  citizenId: {
                    contains: String(searchKey),
                  },
                },
              ],
            },
          },
          {
            home: {
              OR: [
                {
                  apartmentNo: {
                    contains: String(searchKey),
                  },
                },
                {
                  building: {
                    contains: String(searchKey),
                  },
                },
                {
                  homeowner: {
                    fullname: {
                      contains: String(searchKey),
                    },
                  },
                },
                {
                  homeowner: {
                    citizenId: {
                      contains: String(searchKey),
                    },
                  },
                },
              ],
            },
          },
        ],
      };
    }

    const allRents = await prisma.homeContract.findMany({
      include: {
        guest: true,
        home: {
          include: {
            homeowner: true,
          },
        },
      },
      where: whereClause,
    });

    return NextResponse.json(allRents);
  } catch (error) {
    console.error("Error find Home Contract:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const {
      homeId,
      guestId,
      duration,
      payCycle,
      rental,
      deposit,
      status,
      dateEnd,
      dateStart,
    } = await req.json();
    if (
      !homeId ||
      !guestId ||
      !duration ||
      !payCycle ||
      !rental ||
      !dateStart
    ) {
      throw new Error("Invalid information");
    }

    // Kiểm tra xem có hợp đồng nào đang ACTIVE với homeId này không
    const existingActiveContract = await prisma.homeContract.findFirst({
      where: {
        homeId: Number(homeId),
        status: StatusContract.ACTIVE,
      },
    });

    if (existingActiveContract) {
      // Nếu có hợp đồng ACTIVE, trả về lỗi
      return NextResponse.json(
        { message: "An active contract already exists for this homeId" },
        { status: 400 }
      );
    }

    const newContract = await prisma.homeContract.create({
      data: {
        homeId: Number(homeId),
        guestId: Number(guestId),
        duration,
        payCycle,
        rental,
        deposit,
        status: StatusContract.ACTIVE,
        dateEnd,
        dateStart,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json(newContract);
  } catch (error) {
    console.error("Error creating Contract:", error);
  } finally {
    await prisma.$disconnect();
  }
}
