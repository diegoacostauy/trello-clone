import { List } from "@prisma/client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { close } from "node:inspector";
import { copyList } from "@/actions/copy-list";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

export const ListOptions = ({
  data,
  onAddCard
}: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const {
    execute: executeDelete,
  } = useAction(deleteList, {
    onSuccess: (data) => {
      console.log(`List ${data.id} deleted`);
      toast.success(`List ${data.title} deleted`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(`Error deleting list ${data.title}. ${error}`);
      closeRef.current?.click();
    }
  });

  const {
    execute: executeCopy,
  } = useAction(copyList, {
    onSuccess: (data) => {
      console.log(`List ${data.id} copied`);
      toast.success(`List ${data.title} copied`);
      closeRef.current?.click();
    },
    onError: (error) => {
      toast.error(`Error copying list ${data.title}. ${error}`);
      closeRef.current?.click();
    }
  });

  const onDeleteList = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDelete({ id, boardId });
  }

  const onCopyList = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopy({ id, boardId });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto w-auto px-2 py-1">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pb-3 pt-3" side="bottom" align="start">
        <div className="pb-4 text-center text-sm font-medium text-neutral-600">
          List Options
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            variant="ghost"
            className="absolute right-2 top-2 h-auto w-auto p-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          variant="ghost"
          className="h-auto w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
        >
          Add card...
        </Button>
        <form
          action={onCopyList}
        >
          <input type="hidden" id="id" name="id" value={data.id} />
          <input
            type="hidden"
            id="boardId"
            name="boardId"
            value={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="h-auto w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
          >
            Copy List...
          </FormSubmit>
        </form>
        <Separator />
        <form
          action={onDeleteList}
        >
          <input type="hidden" id="id" name="id" value={data.id} />
          <input
            type="hidden"
            id="boardId"
            name="boardId"
            value={data.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="h-auto w-full justify-start rounded-none px-5 py-2 text-sm font-normal"
          >
            Delete List...
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
