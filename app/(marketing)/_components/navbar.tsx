import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
  return (
    <div className="fixed top-0 flex h-[var(--header-height)] w-full items-center border-b bg-white px-4 shadow-sm">
      <div className="container mx-auto flex w-full items-center justify-between">
        <Logo />
        <div className="flex w-full items-center justify-between space-x-4 md:block md:w-auto">
          <Button size="sm" variant="outline" asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">Get Taskify for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
