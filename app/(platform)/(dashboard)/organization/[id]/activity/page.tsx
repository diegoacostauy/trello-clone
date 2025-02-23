import { Info } from "@/app/(platform)/(dashboard)/organization/[id]/_components/info";
import { ActivityList } from "@/app/(platform)/(dashboard)/organization/[id]/activity/_components/activity-list";
import { Separator } from "@radix-ui/react-separator";
import { Suspense } from "react";

export default function ActivityPage() {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2 border-t border-slate-100" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
