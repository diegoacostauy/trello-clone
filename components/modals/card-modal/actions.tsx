"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { QueryKeys } from "@/components/providers/query-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/type";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
  data: CardWithList;
}

export const Actions = ({ data }: ActionsProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const { onClose } = useCardModal();

  const {
    data: copyData,
    execute: executeCopy,
    isLoading: isLoadingCopy,
  } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success("Card copied successfully");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CARD, copyData?.id],
      });
    },
    onError: (error) => {
      toast.error(`Error copying card: ${error}`);
    },
  });

  const {
    data: deleteData,
    execute: executeDelete,
    isLoading: isLoadingDelete,
  } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success("Card deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.CARD, deleteData?.id],
      });
    },
    onError: (error) => {
      toast.error(`Error deleting card: ${error}`);
    },
  });

  const onCopy = () => {
    executeCopy({ id: data.id, boardId: params.boardId as string });
    onClose();
  };

  const onDelete = () => {
    executeDelete({ id: data.id, boardId: params.boardId as string });
    onClose();
  };

  return (
    <div className="mt-2 space-y-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy || isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingCopy || isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="mt-2 space-y-2">
      <Skeleton className="h-4 w-20 bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
      <Skeleton className="h-8 w-full bg-neutral-200" />
    </div>
  );
};
