import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const ActivityList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const activityLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return activityLogs.length ? (
    <ol className="mt-4 space-y-4">
      {activityLogs.map((log) => (
        <ActivityItem key={log.id} log={log} />
      ))}
    </ol>
  ) : (
    <p className="mt-4 text-xs text-muted-foreground">
      No activity found inside this organization.
    </p>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="mt-4 space-y-4">
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="flex items-center gap-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-[400px]" />
        </div>
      ))}
    </ol>
  );
};
