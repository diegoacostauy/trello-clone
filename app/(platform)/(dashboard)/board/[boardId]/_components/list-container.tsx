"use client";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { ListWithCards } from "@/type";
import { ListForm } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import { useEffect, useState } from "react";
import { ListItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export function ListContainer({ boardId, data }: ListContainerProps) {
  const [localList, setLocalList] = useState(data);

  const { execute: executeListOrder, fieldErrors: fieldErrorsList } = useAction(
    updateListOrder,
    {
      onSuccess: () => {
        toast.success("List order updated");
      },
      onError: (error) => {
        toast.error(`Failed to update list order - ${error}`);
      },
    },
  );

  const { execute: executeCardsOrder, fieldErrors: fieldErrorsCards } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card order updated");
    },
    onError: error => {
      toast.error(`Failed to update card order - ${error}`);
    }
  });

  useEffect(() => {
    setLocalList(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    // if dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // user move list
    if (type === "list") {
      const items = reorder(
        localList,
        source.index,
        destination.index
      ).map((item, idx) => ({ ...item, order: idx }));

      setLocalList(items);
      // Trigger server Actions
      executeListOrder({ boardId, items });
    }

    //user move card
    if (type === 'card') {
      let newLocalList = [...localList];
      // source and destination list
      const sourceList = newLocalList.find(list => list.id === source.droppableId);
      const destinationList = newLocalList.find(list => list.id === destination.droppableId);

      if (!sourceList || !destinationList) return;

      //check if card exists
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // check if cards exist on the dest list
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );
        // update order with the new index after moving cards.
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards;
        setLocalList(newLocalList);
        // TODO: trigger server actions
        executeCardsOrder({
          boardId,
          items: reorderedCards
        });
      } else {
      // moving the card to another list
        const newLocalList = [...localList];
        let [movedCard] = sourceList.cards.splice(source.index, 1);
        movedCard = {
          ...movedCard,
          listId: destination.droppableId,
          order: destination.index,
        };
        destinationList.cards.splice(destination.index, 0, movedCard);

        // update order with the new index after moving cards.
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        //Update the order for each card in the destination list
        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // TODO: trigger server actions

        executeCardsOrder({
          boardId,
          items: destinationList.cards
        });

        setLocalList(newLocalList);
      };
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-x-3 after:w-1 after:shrink-0">
            {localList.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            <ListForm />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
