"use client";

import { ListWithCards } from "@/type";
import { ListForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import { useEffect, useState } from "react";
import { ListItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

export function ListContainer({ boardId, data }: ListContainerProps) {
  const [localList, setLocalList] = useState(data);

  useEffect(() => {
    setLocalList(data);
  }, [data]);

  return (
    <div>
      <ol className="flex h-full gap-x-3 after:w-1 after:shrink-0">
        {localList.map((list, index) => (
          <ListItem key={list.id} index={index} data={list} />
        ))}
        <ListForm />
      </ol>
    </div>
  );
}
