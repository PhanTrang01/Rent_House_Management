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
    const { id } = params;
    const service = await prisma.service.findUniqueOrThrow({
      where: {
        serviceId: Number(id),
      },
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
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
    const { name, unit, description } = await _req.json();

    const deleted = await prisma.service.update({
      where: { serviceId: parseInt(id as string, 10) },
      data: {
        name,
        unit,
        description,
      },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error Update  Service:", error);
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

    const deleted = await prisma.service.delete({
      where: { serviceId: parseInt(id as string, 10) },
    });
    return NextResponse.json(deleted);
  } catch (error) {
    console.error("Error read HomeOwner:", error);
  } finally {
    await prisma.$disconnect();
  }
}
