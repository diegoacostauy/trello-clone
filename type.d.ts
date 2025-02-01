import { Card, List } from "@prisma/client";

type Organization = {
  id: string;
  slug: string;
  imageUrl: string;
  name: string;
};

type ListWithCards = List & { cards: Card[] };

type CardWithList = Card & { list: List };
