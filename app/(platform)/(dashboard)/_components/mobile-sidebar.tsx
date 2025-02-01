"use client";

import { Sidebar } from "@/app/(platform)/(dashboard)/_components/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileSidebar() {
  const pathname = usePathname();
  // prevent hydration mismatch, especially when using zustand state or Modal / Sheet components
  const [isMounted, setIsMounted] = useState(false);

  const { onOpen, onClose, isOpen } = useMobileSidebar((state) => state);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) return null;

  return (
    <>
      <Button
        onClick={onOpen}
        className="block bg-gray-100 md:hidden"
        variant="ghost"
        size="sm"
      >
        <MenuIcon />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
}
