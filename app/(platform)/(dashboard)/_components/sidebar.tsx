'use client';

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import NavItem from "@/app/(platform)/(dashboard)/_components/nav-item";

interface SidebarProps {
  storageKey?: string;
}


export default function Sidebar({
  storageKey = "t-sidebar-state"
}: SidebarProps) {

  const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});
  console.log(expanded);

  const {organization: activeOrganization, isLoaded: isLoadedOrg} = useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: {
      infinite: true
    },
  });

  const defaultAccordionValue: string[] = Object.keys(expanded).reduce((acc: string[], key) => {
    if (expanded[key]) {
      acc.push(key)
    }

    return acc;
  }, []);

  const onExpand = (id: string) => {
    setExpanded(curr => ({
      ...curr,
      [id]: !expanded[id]
    }))
  }

  if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
    return (
      <Skeleton/>
    )
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">
          Workspaces
        </span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4"/>
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data?.map((mem) => (
          <NavItem
            key={mem.organization.id}
            isActive={activeOrganization?.id === mem.organization.id}
            isExpanded={expanded[mem.organization.id]}
            organization={mem.organization as Organization}
            onExpand={onExpand}
            />
        ))}
      </Accordion>
    </>
  )
}
