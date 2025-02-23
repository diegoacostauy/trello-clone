import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request, {
  params
}: {
  params: {
    cardId: string;
  };
}) {
  try {
    const { userId, orgId } = auth();
    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", {
        status: 401
      })
    }

    const auditLogs = await db.auditLog.findMany({
      where: {
        orgId,
        entityId: params.cardId,
        entity: ENTITY.CARD
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3,
    });

    return NextResponse.json(auditLogs);

  } catch (error) {
    return new NextResponse("An error occurred", {
      status: 500
    });
  }
}
