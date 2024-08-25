"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'
import {z} from 'zod';

type CreateBoardState = {
  errors?: {
    title?: string[]
  },
  message?: string | null
}

const boardSchema = z.object({
  title: z.string().min(3, {
    message: 'Title must be at least 3 characters long'
  }),
});

export async function createBoard(prevState: CreateBoardState, formData: FormData): Promise<CreateBoardState> {
  // parse will throw an error if the fields are missing or not valid, while
  // SafeParse will not
  const validatedFields = boardSchema.safeParse({
    title: formData.get('title')
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields'
    }
  }
  const {title} = validatedFields.data;

  try {
    const board = await db.board.create({
      data: {
        title
      }
    });
  } catch(error) {
    return {
      errors: {},
      message: `Error creating board. ${error instanceof Error ? error.message : ''}`
    }
  }

  // revalidatePath(`/organization/${id}`);
  redirect(`/organization/org_2kTQc6uKYOR50XvHwmEVBoeSx6K`);
}

export async function deleteBoard(id: string, boardId: string) {
  await db.board.delete({
    where: {
      id: boardId
    }
  });

  revalidatePath(`/organization/${id}`);
}
