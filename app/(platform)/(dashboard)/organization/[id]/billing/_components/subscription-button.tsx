"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SubscriptionButton = ({ isPro }: { isPro: boolean }) => {
  const router = useRouter();
  const { onOpen } = useProModal();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      router.push(data);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleClick = () => {
    if (isPro) {
      execute({});
    } else {
      onOpen();
    }
  };
  return (
    <Button variant="primary" disabled={isLoading} onClick={handleClick}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};
