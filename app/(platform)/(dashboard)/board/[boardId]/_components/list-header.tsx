"use client";

import { ListWithCards } from "@/type";
import { ElementRef, useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/update-list";
import { toast } from "sonner";

interface ListHeaderProps {
  data: ListWithCards;
}

export function ListHeader({ data }: ListHeaderProps) {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const {
    execute,
    data: listData,
    isLoading,
    error,
    fieldErrors,
  } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List updated: ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(`Error updating list: ${error}`);
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      return disableEditing();
    }

    execute({ id, boardId, title });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => setIsEditing(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);

  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form action={handleSubmit} ref={formRef} className="flex-1 px-[2px]">
          <input type="hidden" name="id" id="id" value={data.id} />
          <input
            type="hidden"
            name="boardId"
            id="boardId"
            value={data.boardId}
          />
          <FormInput
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            className="h-7 truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition hover:border-input focus:border-input focus:bg-white"
            placeholder="Enter list title..."
            defaultValue={title}
          />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium"
        >
          {title}
        </div>
      )}
    </div>
  );
}
