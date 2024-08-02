import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/">
      <div className="hidden items-center gap-x-2 transition hover:opacity-75 md:flex">
        <Image src="/logo.svg" alt="Taskify" width={80} height={40} />
        <span className="text:lg font-heading text-neutral-700">Taskify</span>
      </div>
    </Link>
  );
}
