import { Info } from "@/app/(platform)/(dashboard)/organization/[id]/_components/info";
import { SubscriptionButton } from "@/app/(platform)/(dashboard)/organization/[id]/billing/_components/subscription-button";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";

export default async function Billing() {
  const isPro = await checkSubscription();
  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2 border-t border-slate-100" />
      <SubscriptionButton isPro={isPro} />
    </div>
  );
}
