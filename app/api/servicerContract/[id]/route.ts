import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, StatusContract } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: serviceContractId } = params;

    const Homeowners = await prisma.serviceContract.findMany({
      include: {
        home: true,
        homeContracts: true,
        service: true,
      },
      where: {
        serviceContractId: Number(serviceContractId),
      },
    });
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find Service Contract:", error);
  } finally {
    await prisma.$disconnect();
  }
}
