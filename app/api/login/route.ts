import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        {
          message: "Username and password is required",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.accountAdmin.findUnique({
      where: { username },
      select: { username: true, password: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User is not registered",
        },
        {
          status: 401,
        }
      );
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        {
          message: "Password is incorrect",
        },
        {
          status: 401,
        }
      );
    }

    const { username: usernameRes, password: _passwordRes } = user;

    return NextResponse.json({ username: usernameRes });
  } catch (error) {
    console.error("Error Login:", error);
  } finally {
    await prisma.$disconnect();
  }
}
