import { Footer } from "@/app/(marketing)/_components/footer";
import { Navbar } from "@/app/(marketing)/_components/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="bg-slate-100 pb-20 pt-[calc(var(--header-height)+5rem)]">{children}</main>
      <Footer />
    </div>
  );
}
