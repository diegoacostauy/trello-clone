import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ListContainer } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
  const { boardId } = params;
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const boardLists = await db.list.findMany({
    where: {
      boardId: boardId,
      board: {
        orgId,
      },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return (
    <div className="container h-full overflow-x-auto py-4">
      <ListContainer boardId={boardId} data={boardLists} />
    </div>
  );
}
