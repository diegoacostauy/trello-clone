"use client";
import { Board } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ElementRef, useRef, useState } from "react";
import { FormInput } from "@/components/form/form-input";
import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface BoardTitleFormProps {
  data: Board;
}

export function BoardTitleForm({ data }: BoardTitleFormProps) {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const { execute, fieldErrors } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board title updated to: ${data.title}`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    console.log(`Updating title to: ${title}`);
    execute({ title, id: data.id });
  };

  const handleBlur = () => {
    if (inputRef.current?.value === data.title) {
      inputRef.current?.blur();
      setIsEditing(false);
      return;
    }

    formRef.current?.requestSubmit();
  };

  const enableEditing = () => {
    //TODO: focus input
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => setIsEditing(false);

  if (isEditing) {
    return (
      <form
        action={handleSubmit}
        className="flex items-center gap-x-2"
        ref={formRef}
      >
        <FormInput
          id="title"
          ref={inputRef}
          errors={fieldErrors}
          onBlur={handleBlur}
          defaultValue={title}
          className="text-md h-7 border-none bg-transparent px-2 py-1 font-medium focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="text-md group h-auto w-auto p-1 px-2 font-medium"
    >
      {title}

      <Pencil className="ms-2 h-4 w-4 opacity-0 transition duration-200 ease-out group-hover:opacity-100" />
    </Button>
  );
}
