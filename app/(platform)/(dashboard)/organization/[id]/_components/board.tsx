import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/lib/actions";
import { Trash2Icon } from "lucide-react";

export function Board({
  title,
  id,
  orgId,
}: {
  title: string;
  id: string;
  orgId: string;
}) {
  const deleteBoardId = deleteBoard.bind(null, orgId, id);

  return (
    <form
      action={deleteBoardId}
      className="flex items-center justify-between gap-x-2"
    >
      <p>{`Board title: ${title}`}</p>
      <Button
        type="submit"
        variant="destructive"
        size="sm"
        className="inline-flex gap-x-1"
      >
        Delete
        <Trash2Icon className="h-4 w-4" />
      </Button>
    </form>
  );
}
