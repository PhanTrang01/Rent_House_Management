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
    const receiver = await prisma.receiver.findMany();
    return NextResponse.json(receiver);
  } catch (error) {
    console.error("Error read receiver:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    const { name, phone, email, taxcode, STK, TenTK, Nganhang, note, type } =
      await req.json();
    if (!name || !STK || !TenTK || !Nganhang) {
      throw new Error("Invalid name, phone, or citizenId information");
    }

    const newHomeowner = await prisma.receiver.create({
      data: {
        name,
        phone,
        email,
        taxcode,
        STK,
        TenTK,
        Nganhang,
        note,
        type,
      },
    });
    return NextResponse.json(newHomeowner);
  } catch (error) {
    console.error("Error creating Guest:", error);
  } finally {
    await prisma.$disconnect();
  }
}
