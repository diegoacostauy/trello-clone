"use server";
import { InputType, ReturnType } from "@/actions/copy-list/type";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { CopyList } from "@/actions/copy-list/schema";
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
  let list;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      },
      include: {
        cards: true
      }
    });

    if (!listToCopy) {
      return {
        error: "List not found."
      };
    }

    const lastList = await db.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc"
      },
      select: {
        order: true
      }
    });

    list = await db.list.create({
      data: {
        title: `${listToCopy.title} - Copy`,
        order: lastList ? lastList.order + 1 : 1,
        boardId,
        cards: {
          createMany: {
            data: listToCopy.cards.map(card => ({
              title: card.title,
              description: card.description,
              order: card.order
            }))
          }
        }
      },
      include: {
        cards: true
      }
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entity: ENTITY.LIST,
      action: ACTION.CREATE,
    });

  } catch (error) {
    return {
      error: "Failed to copy.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list
  }
};

export const copyList = createSafeAction(CopyList, handler);
