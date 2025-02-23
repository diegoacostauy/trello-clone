"use server";

import { CreateBoard } from "@/actions/create-board/schema";
import { InputType, ReturnType } from "@/actions/create-board/type";
import { createAuditLog } from "@/lib/create-audit-log";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { hasAvailableBoards, incrementBoardCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { ACTION, ENTITY } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { list } from "postcss";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized!",
    };
  }

  const canCreateBoard = await hasAvailableBoards();
  const isPro = await checkSubscription();

  if (!canCreateBoard && !isPro) {
    return {
      error: "You have reached your limit of free boards. Please upgrade to create more."
    }
  }

  const { title, image } = data;
  let board;
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
    image.split("|");

  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHtml ||
    !imageUserName
  ) {
    return {
      error: "Missing fields. Failed to create board.",
    };
  }

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHtml,
        imageUserName,
      },
    });

    if (!isPro) {
      await incrementBoardCount();
    }

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entity: ENTITY.BOARD,
      action: ACTION.CREATE,
    });

  } catch (error) {
    return {
      error: "Failed to create.",
    };
  }

  revalidatePath(`/boards/${board.id}`);
  return {
    data: board,
  };
};

export const createBoard = createSafeAction(CreateBoard, handler);
