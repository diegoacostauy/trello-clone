"use client";

import { updateCard } from "@/actions/update-card";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { QueryKeys } from "@/components/providers/query-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import {
  ElementRef,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const {
    data: cardData,
    execute,
    fieldErrors,
  } = useAction(updateCard, {
    onSuccess: (data) => {
      setDescription(data.description || undefined);
      disableEditing();
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CARD, data.id],
      });
      toast.success(`Description updated`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update description.");
      disableEditing();
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState<string | undefined>(
    data.description || undefined,
  );
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      textAreaRef.current?.focus();
    } else {
      textAreaRef.current?.blur();
    }
  }, [isEditing]);

  const onSubmit = (formData: FormData) => {
    console.log("submit");
    const description = formData.get("description") as string;
    if (description === data.description) return;

    // @TODO: update card description
    execute({
      id: data.id,
      boardId: params.boardId as string,
      description,
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="flex w-full items-start gap-x-3">
      <AlignLeft className="mt-0.5 h-5 w-5 text-neutral-700" />
      <div className="w-full">
        <p className="mb-2 font-semibold text-neutral-700">Description text</p>
        {isEditing ? (
          <form ref={formRef} action={onSubmit} className="space-y-2">
            <FormTextarea
              id="description"
              defaultValue={description}
              ref={textAreaRef}
              errors={fieldErrors}
              placeholder="Add a more detailed description..."
              className="min-h-[78px] rounded-md border-0 bg-neutral-200 px-3.5 py-3 text-sm font-normal text-neutral-700 placeholder:text-neutral-500"
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            tabIndex={0}
            role="button"
            className="min-h-[78px] rounded-md bg-neutral-200 px-3.5 py-3 text-sm font-normal text-neutral-500"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex w-full items-start gap-x-3">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="mb-2 h-6 w-24 bg-neutral-200" />
        <Skeleton className="mb-2 h-[78px] w-full bg-neutral-200" />
      </div>
    </div>
  );
};
