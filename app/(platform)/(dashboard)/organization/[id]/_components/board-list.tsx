import { FormPopover } from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { HelpCircle, User2 } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/config/constants/board";
import { getAvailableBoards } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

export async function BoardList() {
  const { orgId } = auth();

  if (!orgId) {
    return redirect(`/select-org`);
  }

  const availableBoards = await getAvailableBoards();
  const isPro = await checkSubscription();

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center text-lg font-semibold text-neutral-700">
        <User2 className="mr-2 h-6 w-6" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {boards.map((board) => (
          <Link
            href={`/board/${board.id}`}
            key={board.id}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className="relative block aspect-video h-full w-full overflow-hidden rounded-sm bg-sky-700 bg-cover bg-center bg-no-repeat p-2 after:absolute after:inset-0 after:bg-black/30 after:transition after:duration-200 hover:after:bg-black/40"
          >
            <span className="relative z-10 font-semibold text-white">
              {board.title}
            </span>
          </Link>
        ))}
        <FormPopover side="right" sideOffset={10}>
          <div
            role="button"
            className="relative flex aspect-video h-full w-full flex-col items-center justify-center gap-y-1 rounded-sm bg-muted transition hover:opacity-75"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {isPro
                ? "Unlimited"
                : `${MAX_FREE_BOARDS - availableBoards} remaining`}
            </span>
            <Hint
              sideOffset={40}
              description="Free workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace."
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
}

BoardList.Skeleton = function SkeletonBoard() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} className="aspect-video h-full w-full p-2" />
      ))}
    </div>
  );
};
