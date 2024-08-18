"use client";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Activity,
  CreditCard,
  Layout,
  Settings
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface NavItemProps {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export default function NavItem({
  isExpanded,
  isActive,
  organization,
  onExpand,
}: NavItemProps) {

  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (href: string) => {
    router.push(href);
  }

  const routes = [
    {
      label: "Boards",
      icon: <Layout className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing`
    },
  ];

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 rounded-md p-1.5 text-start text-neutral-700 no-underline transition hover:bg-neutral-500/10 hover:no-underline",
          isActive && !isExpanded && "bg-sky-500/10 text-sky-700",
        )}
      >
        <div className="gap-x-2 flex items-center">
          <div className="relative h-7 w-7">
            <Image
              fill
              src={organization.imageUrl}
              alt={`${organization.name} logo`}
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">
            {organization.name}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            onClick={() => handleClick(route.href)}
            variant="ghost"
            className={cn(
              "w-full font-normal justify-start pl-10 mb-1",
              pathname == route.href && "bg-sky-500/10 text-sky-700"
            )}
          >
            {route.icon} {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function NavItemSkeleton() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute"></Skeleton>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

NavItem.Skeleton = NavItemSkeleton;
