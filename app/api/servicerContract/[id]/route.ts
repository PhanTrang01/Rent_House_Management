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

export async function PUT(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await _req.json(); // Đọc dữ liệu từ req.

    const updatedHomeowner = await prisma.serviceContract.update({
      where: { serviceContractId: Number(id) },
      data: {
        statusContract: status as StatusContract,
      },
    });

    return NextResponse.json(updatedHomeowner);
  } catch (error) {
    console.error("Error updating Home Owner:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deletedContract = await prisma.serviceContract.delete({
      where: { serviceContractId: parseInt(id as string, 10) },
    });

    const deletedInvoice = await prisma.invoicesPayment.deleteMany({
      where: { serviceContractId: parseInt(id as string, 10) },
    });

    return NextResponse.json(deletedContract);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
