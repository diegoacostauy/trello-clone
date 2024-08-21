import Board from "@/app/(platform)/(dashboard)/organization/[id]/_components/board";
import BoardForm from "@/app/(platform)/(dashboard)/organization/[id]/_components/board-form";
import { db } from "@/lib/db";

export default async function OrganizationPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {

  const boards = await db.board.findMany({});

  return (
    <div className="flex flex-col gap-10">
      <BoardForm />
      <ul className="divide-y *:py-4 first:*:pt-0 last:*:pb-0">
        {boards.map((board) => (
          <li key={board.id} className="p-2">
            <Board title={board.title} id={board.id} orgId={id}/>
          </li>
        ))}
      </ul>
    </div>
  );
}
