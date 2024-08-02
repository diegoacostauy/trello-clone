import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Footer() {
  return (
    <div className="fixed bottom-0 flex w-full items-center border-t bg-slate-100 py-4">
      <div className="container mx-auto flex w-full items-center justify-between">
        <Logo />
        <div className="flex w-full items-center justify-between space-x-4 md:block md:w-auto">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms of service
          </Button>
        </div>
      </div>
    </div>
  );
}
