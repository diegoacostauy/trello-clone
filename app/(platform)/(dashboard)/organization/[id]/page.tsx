import { BoardList } from "@/app/(platform)/(dashboard)/organization/[id]/_components/board-list";
import { Info } from "@/app/(platform)/(dashboard)/organization/[id]/_components/info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

export default async function OrganizationPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className="mb-20 w-full">
      <Info />
      <Separator className="my-4" />
      <Suspense fallback={<BoardList.Skeleton />}>
        <BoardList />
      </Suspense>
    </div>
  );
}
