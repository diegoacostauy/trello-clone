"use server";

import { InputType, ReturnType } from "@/actions/create-card/type";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "@/actions/create-card/schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized!",
    };
  }

  const { title, boardId, listId } = data;
  let card;
  try {
    const list = await db.list.findUnique({
      where: {
        boardId,
        id: listId,
      }
    });

    if (!list) {
      return {
        error: "List not found.",
      };
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId,
      },
      orderBy: {
        order: "desc"
      },
      select: {
        order: true
      }
    });

    card = await db.card.create({
      data: {
        title,
        order: lastCard ? lastCard.order + 1 : 1,
        listId,
      }
    });

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entity: ENTITY.CARD,
      action: ACTION.CREATE,
    });

  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card,
  };
};

export const createCard = createSafeAction(CreateCard, handler);
