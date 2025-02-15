"use client";

import { ListWithCards } from "@/type";
import { ListHeader } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-item";

interface ListItemProps {
  index: number;
  data: ListWithCards;
}

export function ListItem({ index, data }: ListItemProps) {
  const textareaRef = useRef<ElementRef<'textarea'>>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  return (
    <li className="h-full w-[272px] shrink-0 select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md">
        <ListHeader data={data} onAddCard={enableEditing}/>
        <ol
          className={cn(
            "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
            data.cards.length > 0 ? "mt-2" : "mt-0"
          )}
        >
          {
            data.cards.map((card, index) => (
              <CardItem
                key={card.id}
                index={index}
                data={card}
              />
            ))
          }
        </ol>
        <CardForm
          listId={data.id}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
}
