import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Make sure this URL is correctly set
    },
  },
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: homeId } = params;
    const home = await prisma.homes.findMany({
      where: {
        homeId: Number(homeId),
      },
    });

    return NextResponse.json(home);
  } catch (error) {
    console.error("Error find Home:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// export async function PUT(req: Request) {
//   try {
//     const { _homeId, active, address } = await req.json();

//     if (!_homeId || !active) {
//       throw new Error("Invalid status or orderId information");
//     }

//     const home = await prisma.homes.update({
//       where: { homeId: _homeId },
//       data: { active, address },
//     });

//     return NextResponse.json({ home });
//   } catch (error) {
//     console.error("Error find Home:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
