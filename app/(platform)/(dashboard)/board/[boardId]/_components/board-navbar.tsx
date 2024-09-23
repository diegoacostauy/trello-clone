import { notFound } from "next/navigation";
import { Board } from "@prisma/client";
import BoardTitleForm from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-title-form";
import BoardOptions from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-options";

interface BoardNavbarProps {
  data: Board;
}

export default async function BoardNavbar({ data }: BoardNavbarProps) {
  if (!data) {
    return notFound();
  }

  return (
    <div className="fixed top-[var(--header-height)] z-40 flex h-14 w-full items-center bg-black/50 text-white">
      <div className="gapx-4 container flex items-center">
        <BoardTitleForm data={data} />
        <div className="ms-auto">
          <BoardOptions id={data.id} />
        </div>
      </div>
    </div>
  );
}
