import { Navbar } from "@/app/(platform)/(dashboard)/_components/navbar";

export default function OrganizationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <Navbar />
      {children}
    </div>
  );
}
