import { Sidebar } from "@/app/(platform)/(dashboard)/_components/sidebar";

export default function OrganizationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="pt-[calc(var(--header-height)+2rem)]">
      <div className="container mx-auto">
        <div className="flex gap-x-7">
          <div className="srhink-0 hidden w-64 md:block">
            <Sidebar />
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
