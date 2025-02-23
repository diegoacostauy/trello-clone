"use server";
import { InputType, ReturnType } from "@/actions/copy-card/type";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CopyCard } from "@/actions/copy-card/schema";
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
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          board: {
            orgId
          }
        }
      }
    });

    if (!cardToCopy) {
      return {
        error: "Card not found.",
      };
    }

    const lastCard = await db.card.findFirst({
      where: {
        listId: cardToCopy.listId,
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
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: lastCard ? lastCard.order + 1 : 0,
        listId: cardToCopy.listId,
      }
    })

    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entity: ENTITY.CARD,
      action: ACTION.CREATE,
    });

  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: card
  }
};

export const copyCard = createSafeAction(CopyCard, handler);
