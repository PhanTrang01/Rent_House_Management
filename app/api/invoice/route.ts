import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, TypeInvoice } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const homeContractId = searchParams.get("homeContractId") ?? " ";
    const serviceContractId = searchParams.get("serviceContractId") ?? " ";
    const type = searchParams.get("type") ?? " ";
    const date = searchParams.get("date") ?? " ";

    let _type: TypeInvoice;

    if (type === "HOME") {
      _type = TypeInvoice.HOME;
    } else {
      _type = TypeInvoice.SERVICE;
    }

    const dateQuery = new Date(date);

    const Homeowners = await prisma.invoicesPayment.findMany({
      include: {
        home: true,
        homeContract: true,
        serviceContract: true,
        receiver: true,
      },
      where: {
        OR: [
          { homeContractId: Number(homeContractId) },
          { serviceContractId: Number(serviceContractId) },
        ],
        type: _type,
      },
    });
    return NextResponse.json(Homeowners);
  } catch (error) {
    console.error("Error find invoicesPayment:", error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  try {
    let lastInvoice;
    const {
      serviceContractId,
      homeContractId,
      homeId,
      dateStart,
      type,
      receiverId,
      duration,
      cycle,
      rental,
      limit,
      totalSend,
    } = await req.json();

    if (homeContractId !== null && serviceContractId === null) {
      // Kiểm tra xem có hóa đơn nào với homeContractId này không
      const existingInvoice = await prisma.invoicesPayment.findFirst({
        where: {
          homeContractId: Number(homeContractId),
        },
      });
      if (existingInvoice) {
        // Nếu có, trả về lỗi
        return NextResponse.json(
          { error: "Hợp đồng đã được  sinh đợt thanh toán" },
          { status: 400 }
        );
      }

      const times = duration / cycle;
      const totalPay = rental * cycle;
      for (let index = 0; index < times; index++) {
        // Create a new Date object and add cycle*index months
        // const datePayment = new Date();
        const newDatePayment = new Date(dateStart);
        newDatePayment.setMonth(newDatePayment.getMonth() + cycle * index);
        const nextDatePayment = new Date(newDatePayment);
        nextDatePayment.setMonth(newDatePayment.getMonth() + cycle);
        // datePaymentRemind là ngày gửi thông báo về thanh toán cho khách hàng = newdatePayment luôn

        // datePaymentExpect là hạn khách thuê cần thanh toán. Sau nhắc hẹn 5 ngày.
        const datePaymentExpect = new Date(newDatePayment);
        datePaymentExpect.setDate(datePaymentExpect.getDate() + 5);

        // datePaymentReal là ngày gửi thông báo cần thanh toán co chủ nhà or  dịch vụ. Sau hạn khách hàng thanh toán 2 ngày
        const datePaymentReal = new Date(newDatePayment);
        datePaymentReal.setDate(datePaymentReal.getDate() + 7);

        const Invoice = await prisma.invoicesPayment.create({
          data: {
            serviceContractId: null,
            homeContractId: Number(homeContractId),
            homeId: Number(homeId),
            type,
            dateStart: newDatePayment,
            dateEnd: nextDatePayment,
            totalReceiver: Number(totalPay),
            totalSend: Number(totalSend) * Number(cycle),
            receiverId: Number(receiverId),
            datePaymentExpect,
            datePaymentRemind: newDatePayment,
            datePaymentReal,
            statusPayment: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        lastInvoice = Invoice;
      }
      return NextResponse.json(lastInvoice);
    } else if (serviceContractId && type === TypeInvoice.SERVICE) {
      // Kiểm tra xem có hóa đơn nào với ServiceContractId này không
      // const existingInvoice = await prisma.invoicesPayment.findFirst({
      //   where: {
      //     serviceContractId: Number(serviceContractId),
      //   },
      // });
      // if (existingInvoice) {
      //   // Nếu có, trả về lỗi
      //   return NextResponse.json(
      //     { message: "Hợp đồng dịch vụ đã được sinh đợt thanh toán" },
      //     { status: 401 }
      //   );
      // }
      const times = duration / cycle;
      const totalPay = limit * cycle;
      for (let index = 0; index < times; index++) {
        // Create a new Date object and add cycle*index months
        // const datePayment = new Date();
        const newDatePayment = new Date(dateStart);
        newDatePayment.setMonth(newDatePayment.getMonth() + cycle * index);
        const nextDatePayment = new Date(newDatePayment);
        nextDatePayment.setMonth(newDatePayment.getMonth() + cycle);
        // datePaymentRemind là ngày gửi thông báo về thanh toán cho khách hàng = newdatePayment luôn

        // datePaymentExpect là hạn khách thuê cần thanh toán. Sau nhắc hẹn 5 ngày.
        const datePaymentExpect = new Date(newDatePayment);
        datePaymentExpect.setDate(datePaymentExpect.getDate() + 5);

        // datePaymentReal là ngày gửi thông báo cần thanh toán co chủ nhà or  dịch vụ. Sau hạn khách hàng thanh toán 2 ngày
        const datePaymentReal = new Date(newDatePayment);
        datePaymentReal.setDate(datePaymentReal.getDate() + 7);

        const Invoice = await prisma.invoicesPayment.create({
          data: {
            serviceContractId: Number(serviceContractId),
            homeContractId: Number(homeContractId),
            homeId: Number(homeId),
            type,
            dateStart: newDatePayment,
            dateEnd: nextDatePayment,
            totalReceiver: Number(totalPay),
            totalSend: Number(totalSend) * Number(cycle),
            receiverId: Number(receiverId),
            datePaymentExpect,
            datePaymentRemind: newDatePayment,
            datePaymentReal,
            statusPayment: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        lastInvoice = Invoice;
      }
      return NextResponse.json(lastInvoice);
    } else {
      return NextResponse.json({ message: "Invalid contract data" });
    }
  } catch (error) {
    console.error("Error create Home Contract:", error);
  } finally {
    await prisma.$disconnect();
    // return NextResponse.json({ message: "Operation completed successfully" });
  }
}
