"use client";

import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";
import { useEffect } from "react";

export function OrgControl() {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    const id = params.id as string;

    setActive({
      organization: id,
    });
  }, [setActive, params.id]);

  return null;
}
