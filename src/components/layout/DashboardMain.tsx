"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "./Topbar";
import { MobileHeader } from "./MobileHeader";
import { MobileNav } from "./MobileNav";

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPos = pathname.startsWith("/pos");

  return (
    <main className="flex flex-col flex-1 lg:ml-[240px] h-full overflow-hidden">
      <Topbar />
      <MobileHeader />
      <div
        className={`flex-1 min-h-0 pb-[76px] lg:pb-0 ${
          isPos ? "overflow-hidden" : "overflow-auto no-scrollbar"
        }`}
      >
        {children}
      </div>
      <MobileNav />
    </main>
  );
}
