"use server";
import { InputType, ReturnType } from "@/actions/delete-list/type";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { DeleteList } from "@/actions/delete-list/schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { revalidatePath } from "next/cache";

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
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId
        }
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete.",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return {
    data: list
  }
};

export const deleteList = createSafeAction(DeleteList, handler);
