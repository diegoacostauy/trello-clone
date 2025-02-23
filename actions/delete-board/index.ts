"use server";
import { InputType, ReturnType } from "@/actions/delete-board/type";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DeleteBoard } from "@/actions/delete-board/schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY } from "@prisma/client";
import { decreaseBoardCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

export const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized!",
    };
  }

  const isPro = await checkSubscription();

  const { id } = data;
  let board;

  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    if (!isPro) {
      await decreaseBoardCount();
    }

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entity: ENTITY.BOARD,
      action: ACTION.DELETE,
    });

  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
