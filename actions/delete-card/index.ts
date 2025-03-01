"use server";
import { InputType, ReturnType } from "@/actions/delete-card/type";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DeleteCard } from "@/actions/delete-card/schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY } from "@prisma/client";

export const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return {
      error: "Unauthorized!",
    };
  }

  const { id, boardId } = data;
  let card;

  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    });

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entity: ENTITY.CARD,
      action: ACTION.DELETE,
    });

  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card
  }
};

export const deleteCard = createSafeAction(DeleteCard, handler);
