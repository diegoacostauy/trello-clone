import OrgControl from "@/app/(platform)/(dashboard)/organization/[id]/_components/org-control"

export default function OrganizationLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  )
}
