import { Button } from "@/components/ui/button"
import { deleteBoard } from "@/lib/actions";
import { Trash2Icon } from "lucide-react"

export default function Board({
  title,
  id,
  orgId
}: {
  title: string,
    id: string,
  orgId: string
}) {
  const deleteBoardId = deleteBoard.bind(null, orgId, id);

  return (
    <form action={deleteBoardId} className="flex items-center gap-x-2 justify-between">
      <p>
        {`Board title: ${title}`}
      </p>
      <Button type="submit" variant="destructive" size="sm" className="inline-flex gap-x-1">
        Delete
        <Trash2Icon className="w-4 h-4" />
      </Button>
    </form>
  )
}
