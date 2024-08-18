import MobileSidebar from "@/app/(platform)/(dashboard)/_components/mobile-sidebar";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-[var(--header-height)] w-full items-center border-b bg-white shadow-sm">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      <div className="container flex items-center gap-x-4">
        <div className="flex items-center gap-x-4">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <Button
            size="sm"
            variant="primary"
            className="block h-auto rounded-sm px-2 py-1.5"
          >
            <span className="hidden md:block">Create</span>
            <Plus className="block h-4 w-4 md:hidden" />
          </Button>
        </div>
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl={`/organization/:id`}
          afterLeaveOrganizationUrl={`/select-org`}
          afterSelectOrganizationUrl={`/organization/:id`}
          appearance={{
            elements: {
              rootBox: "flex items-center justify-center ms-auto",
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </nav>
  );
}
