"use client";
import { ListWrapper } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-wrapper";
import { Plus, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { createList } from "@/actions/create-list";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";

export function ListForm() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => setIsEditing(false);

  const { execute, fieldErrors, error, isLoading, data } = useAction(
    createList,
    {
      onSuccess: (data) => {
        toast.success(`List created: ${data.title} in the ${data.order}`);
        disableEditing();
        // router.refresh();
      },
      onError: (error) => {
        toast.error(error);
      },
      onComplete: () => {
        console.log(`Complete action ${data?.title}`);
      },
    },
  );

  const params = useParams();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({ title, boardId });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={handleSubmit}
          ref={formRef}
          className="w-full space-y-4 rounded-md bg-white p-3 shadow-md"
        >
          <FormInput
            id="title"
            errors={fieldErrors}
            disabled={isLoading}
            ref={inputRef}
            type="text"
            className="h-7 border-transparent px-2 py-1 text-sm font-medium transition hover:border-input focus:border-input"
            placeholder="Enter list title..."
          />
          <input type="hidden" value={params.boardId} name="boardId" />
          <div className="flex items-center gap-x-1">
            <FormSubmit disabled={isLoading}>Add List</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="flex w-full items-center rounded-md bg-white/70 p-3 text-sm font-medium transition hover:bg-white/50"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add a list
      </button>
    </ListWrapper>
  );
}
