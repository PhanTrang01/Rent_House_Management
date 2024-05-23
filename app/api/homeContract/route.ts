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
    const { searchParams } = new URL(req.nextUrl);
    const searchKey = searchParams.get("q") ?? " ";
    const guestId = searchParams.get("guestId") ?? " ";
    const homeId = searchParams.get("homeId") ?? " ";

    const allRents = await prisma.homeContract.findMany({
      include: {
        guest: true,
        home: {
          include: {
            homeowner: true,
          },
        },
      },
      where: {
        OR: [
          {
            guest: {
              OR: [
                { guestId: Number(guestId) },
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
                { homeId: Number(homeId) },
                {
                  address: {
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
              ],
            },
          },
        ],
      },
    });
    //   console.dir(allUsers, { depth: null });
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
        { error: "An active contract already exists for this homeId" },
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

// export async function POST(req: Request) {
//   try {
//     let lastInvoice;
//     const {
//       serviceContractId,
//       homeContractId,
//       homeId,
//       dateStart,
//       limit,
//       receiverId,
//       duration,
//       cycle,
//       rental,
//       datePaymentRemind,
//       datePaymentReal,
//     } = await req.json();

//     const times = duration / cycle;
//     const totalPay = rental * cycle;
//     for (let index = 0; index < times; index++) {
//       // Create a new Date object and add cycle*index months
//       // const datePayment = new Date();
//       const newDatePayment = new Date(dateStart);
//       newDatePayment.setMonth(newDatePayment.getMonth() + cycle * index);
//       const nextDatePayment = new Date(newDatePayment);
//       nextDatePayment.setMonth(newDatePayment.getMonth() + cycle);

//       const Invoice = await prisma.invoicesPayment.create({
//         data: {
//           serviceContractId: Number(serviceContractId),
//           homeContractId: Number(homeContractId),
//           homeId: Number(homeId),
//           type: "EVN",
//           dateStart: newDatePayment,
//           dateEnd: nextDatePayment,
//           total: Number(totalPay),
//           limit: Number(duration),
//           receiverId: Number(receiverId),
//           datePaymentExpect: newDatePayment,
//           datePaymentRemind: new Date(datePaymentRemind),
//           datePaymentReal: new Date(datePaymentReal),
//           statusPayment: false,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });
//       lastInvoice = Invoice;
//     }
//     return NextResponse.json(lastInvoice);
//   } catch (error) {
//     console.error("Error create Home Contract:", error);
//   } finally {
//     await prisma.$disconnect();
//     // return NextResponse.json({ message: "Operation completed successfully" });
//   }
// }
