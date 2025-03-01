"use client";
import { Actions } from "@/components/modals/card-modal/actions";
import { Activity } from "@/components/modals/card-modal/activity";
import { Description } from "@/components/modals/card-modal/description";
import { Header } from "@/components/modals/card-modal/header";
import { QueryKeys } from "@/components/providers/query-provider";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/type";
import { AuditLog } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const CardModal = () => {
  const { id, isOpen, onClose } = useCardModal();

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: [QueryKeys.CARD, id],
    queryFn: () => fetcher(`/api/cards/${id}`),
  });

  const { data: auditLogs } = useQuery<AuditLog[]>({
    queryKey: [QueryKeys.LOGS, id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}

              {!auditLogs ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogs} />
              )}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
