import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, StatusContract } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const homeContractId = searchParams.get("homeContractId") ?? " ";

    const Homeowners = await prisma.serviceContract.findMany({
      include: {
        home: true,
        homeContracts: true,
        service: true,
      },
      where: {
        homeContractsId: Number(homeContractId),
      },
    });
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find Service Contract:", error);
  } finally {
    await prisma.$disconnect();
  }
}
export async function POST(req: Request) {
  try {
    const {
      homeContractId,
      homeId,
      guestId,
      serviceId,
      unitCost,
      limit,
      duration,
      payCycle,
      status,
      dateEnd,
      dateStart,
    } = await req.json();
    if (
      !homeId ||
      !guestId ||
      !duration ||
      !serviceId ||
      !dateStart ||
      !homeContractId
    ) {
      throw new Error("Invalid information");
    }

    const newContract = await prisma.serviceContract.create({
      data: {
        homeContractsId: Number(homeContractId),
        homeId: Number(homeId),
        guestId: Number(guestId),
        serviceId,
        duration,
        payCycle,
        unitCost,
        limit: Number(limit),
        statusContract: StatusContract.ACTIVE,
        dateEnd: new Date(dateEnd),
        dateStart: new Date(dateStart),
        signDate: new Date(),
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
