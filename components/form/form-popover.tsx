"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import { ReactNode, useState } from "react";
import { FormPicker } from "@/components/form/form-picker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface FormPopoverProps {
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function FormPopover({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: FormPopoverProps) {
  const router = useRouter();
  // const closeRef = useRef<ElementRef<"button">>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { onOpen } = useProModal();
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      // closeRef.current?.click();
      setPopoverOpen(false);
      toast.success("Board created successfully");
      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);
      onOpen();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;
    await execute({ title, image });
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-80 pt-3"
      >
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          Create board
        </div>
        <PopoverClose
          // ref={closeRef}
          asChild
          className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
        >
          <Button variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form className="space-y-4" action={handleSubmit}>
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              label="Board name"
              id="title"
              type="text"
              errors={fieldErrors}
            />
          </div>
          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
