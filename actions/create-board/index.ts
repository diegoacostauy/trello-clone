"use server";

import { CreateBoard } from "@/actions/create-board/schema";
import { InputType, ReturnType } from "@/actions/create-board/type";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();


  if (!userId) {
    return {
      error: "Unahthorized!",
    }
  }

  const { title } = data;
  let board;

  try {
    throw new Error();
    board = await db.board.create({
      data: {
        title,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create."
    }
  }

  revalidatePath(`/boards/${board.id}`);
  return {
    data: board
  }
}

export const createBoard = createSafeAction(CreateBoard, handler);
