"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ProModal = () => {
  const { isOpen, onClose } = useProModal();
  const router = useRouter();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      toast.success(`Redirecting to Stripe...`);
      // window.location.href = data;
      router.push(data);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="relative flex aspect-video items-center justify-center">
          <Image
            src="/hero-illustration.svg"
            alt="Hero Pro"
            fill
            className="object-cover"
          />
        </div>
        <div className="mx-auto space-y-6 p-6 text-neutral-700">
          <div>
            <h2 className="text-xl font-semibold">
              Upgrade to Taskify Pro Today!
            </h2>
            <p className="font-normal text-neutral-600">
              Explore the best of Taskify.
            </p>
          </div>
          <div className="pl-3">
            <ul className="list-disc text-sm">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            disabled={isLoading}
            onClick={onClick}
            className="w-full"
            variant="primary"
          >
            <span>Upgrade to Pro</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
