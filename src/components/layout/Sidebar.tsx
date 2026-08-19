"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package2,
  BarChart2,
  ClipboardList,
  CalendarCheck,
  Settings,
  Info,
  ChevronDown,
  HeartPulse,
} from "lucide-react";
import { User, Pharmacy } from "../../api/core.api";

interface SidebarProps {
  user: User | null;
  pharmacy: Pharmacy | null;
}

const NAV_GROUPS = [
  {
    label: "Principal",
    items: [
      { name: "Tableau de bord", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Gestion",
    items: [
      { name: "Caisse POS", href: "/pos", icon: ShoppingCart },
      { name: "Produits & Stock", href: "/inventory", icon: Package2 },
      { name: "Rapports", href: "/reports", icon: BarChart2 },
      { name: "Journal d'activité", href: "/activity", icon: ClipboardList },
      { name: "Réservations", href: "/reservations", icon: CalendarCheck },
    ],
  },
  {
    label: "Admin",
    items: [
      { name: "Paramètres", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ user, pharmacy }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-2 top-2 bottom-2 w-[228px] rounded-2xl bg-white/88 backdrop-blur-[24px] saturate-180 border border-border-glass shadow-sidebar flex flex-col z-20">
      {/* Brand Header */}
      <div className="flex items-center gap-3 p-5">
        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0">
          <HeartPulse size={15} />
        </div>
        <div>
          <h1 className="text-text-primary text-[14px] font-bold leading-none mb-1 tracking-tight">Magali</h1>
          <p className="text-text-placeholder text-[10px] font-medium leading-none uppercase tracking-[0.05em] truncate">
            {pharmacy?.name || "Chargement..."}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6 no-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <h2 className="text-text-hairline text-[9px] font-bold uppercase tracking-[0.08em] mb-2 px-3">
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-4xl text-xs font-medium transition-all duration-150 ${isActive
                      ? "bg-brand-primary text-white shadow-button"
                      : "text-text-secondary hover:bg-surface-muted hover:text-brand-primary"
                      }`}
                  >
                    <item.icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                    {item.name}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-accent ml-auto" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Area */}
      <div className="mt-auto">
        <div className="border-t border-border-main mx-4 mb-2"></div>

        <div className="p-3 pt-0">
          <Link
            href="/help"
            className="flex items-center gap-3 px-3 py-2 mb-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-brand-primary transition-colors"
          >
            <Info size={16} />
            Aide & documentation
          </Link>

          <div className="flex items-center justify-between p-3 rounded-3xl hover:bg-surface-muted transition-colors cursor-pointer border border-transparent">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                {user?.initials || "..."}
              </div>
              <div className="overflow-hidden">
                <p className="text-text-primary text-[13px] font-bold leading-tight truncate group-hover:text-brand-primary transition-colors">
                  {user?.name || "Chargement..."}
                </p>
                <p className="text-text-placeholder text-[11px] font-medium leading-tight truncate">
                  {user?.role || "..."}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className="text-text-placeholder shrink-0 ml-2" />
          </div>
        </div>
      </div>
    </aside>
  );
}