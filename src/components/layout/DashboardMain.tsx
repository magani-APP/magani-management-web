"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "./Topbar";

export function DashboardMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPos = pathname.startsWith("/pos");

  return (
    <main className="flex flex-col flex-1 ml-[240px] h-full overflow-hidden">
      <Topbar />
      <div
        className={`flex-1 min-h-0 ${
          isPos ? "overflow-hidden" : "overflow-auto no-scrollbar"
        }`}
      >
        {children}
      </div>
    </main>
  );
}
