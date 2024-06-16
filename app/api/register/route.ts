import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      throw new Error("username and password is required");
    }

    const user = await prisma.accountAdmin.findUnique({
      where: { username },
      select: { username: true },
    });

    if (user) {
      return NextResponse.json(
        {
          message: "User is already existed",
        },
        {
          status: 400,
        }
      );
    }

    const passwordHash = await bcrypt.hash(password, 3);

    const newUser = await prisma.accountAdmin.create({
      data: { username, password: passwordHash },
      select: {
        username: true,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error Register:", error);
  } finally {
    await prisma.$disconnect();
  }
}
