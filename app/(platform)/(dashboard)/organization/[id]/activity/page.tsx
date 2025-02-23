import { Info } from "@/app/(platform)/(dashboard)/organization/[id]/_components/info";
import { ActivityList } from "@/app/(platform)/(dashboard)/organization/[id]/activity/_components/activity-list";
import { checkSubscription } from "@/lib/subscription";
import { Separator } from "@radix-ui/react-separator";
import { Suspense } from "react";

export default async function ActivityPage() {
  const isPro = await checkSubscription();
  console.log({
    isPro,
  });
  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2 border-t border-slate-100" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
