"use client";

import { ListWithCards } from "@/type";
import { ListHeader } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export function ListItem({ index, data }: ListItemProps) {
  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] pb-2 shadow-md">
        <ListHeader data={data} />
      </div>
    </li>
  );
}
