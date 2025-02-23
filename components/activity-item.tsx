import { format } from "date-fns";
import { AuditLog } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateLogMsg } from "@/lib/generate-log-msg";

export const ActivityItem = ({ log }: { log: AuditLog }) => {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={log.userImage} alt={log.userName} />
      </Avatar>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold lowercase text-neutral-600">
            {log.userName}
          </span>{" "}
          {generateLogMsg(log)}
        </p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(log.createdAt), "MM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </li>
  );
};
