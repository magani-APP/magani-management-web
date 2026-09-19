"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package2,
  CalendarCheck,
  MoreHorizontal,
  BarChart2,
  ClipboardList,
  Settings,
  Bot,
  Info,
  LogOut,
} from "lucide-react";
import { logout } from "@/api/auth.api";
import { useMagaVisibility } from "@/hooks/settings/useMagaVisibility";

const TABS = [
  { name: "Accueil", href: "/", icon: LayoutDashboard },
  { name: "Caisse", href: "/pos", icon: ShoppingCart },
  { name: "Stock", href: "/inventory", icon: Package2 },
  { name: "Réserv.", href: "/reservations", icon: CalendarCheck },
];

// Pages accessibles uniquement via la feuille "Plus" sur mobile : le bouton
// "Plus" doit rester actif quand on se trouve sur l'une d'entre elles.
const MORE_PATHS = ["/reports", "/activity", "/settings", "/help"];

const MORE_ITEMS = [
  { name: "Rapports", href: "/reports", icon: BarChart2 },
  { name: "Journal", href: "/activity", icon: ClipboardList },
  { name: "Paramètres", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { enabled: isMagaVisible } = useMagaVisibility();

  const isMoreActive = MORE_PATHS.some((path) => pathname.startsWith(path));

  // Ferme la feuille à chaque changement de page.
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isSheetOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsSheetOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSheetOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Logout]", error);
      }
    } finally {
      router.replace("/login");
    }
  }

  return (
    <>
      {/* Feuille "Plus" (bottom sheet) */}
      {isSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div
            className="absolute inset-0 bg-brand-darkest/30 backdrop-blur-[2px]"
            onClick={() => setIsSheetOpen(false)}
          />
          <div
            ref={sheetRef}
            className="absolute left-2 right-2 bottom-[76px] rounded-2xl border border-border-card bg-white shadow-sidebar overflow-hidden"
          >
            <div className="p-3">
              {isMagaVisible && (
                <Link
                  href="/help"
                  className={`flex items-center gap-3 px-3 py-2.5 mb-1 rounded-xl text-xs font-medium transition-colors ${
                    pathname === "/help"
                      ? "bg-brand-primary text-white shadow-button"
                      : "text-text-secondary hover:bg-surface-muted hover:text-brand-primary"
                  }`}
                >
                  <Bot size={16} />
                  Maga — officine
                </Link>
              )}
              <button
                type="button"
                className="flex w-full items-center gap-3 px-3 py-2.5 mb-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-brand-primary transition-colors"
              >
                <Info size={16} />
                Aide & documentation
              </button>

              <h2 className="text-text-hairline text-[9px] font-bold uppercase tracking-[0.08em] mb-2 px-3">
                Gestion
              </h2>
              <div className="space-y-1 mb-2">
                {MORE_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-brand-primary text-white shadow-button"
                          : "text-text-secondary hover:bg-surface-muted hover:text-brand-primary"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-border-main pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-status-danger hover:bg-status-danger-bg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut size={15} />
                  {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barre d'onglets */}
      <nav className="flex lg:hidden fixed left-0 right-0 bottom-0 z-20 items-stretch justify-around bg-white/95 backdrop-blur-[20px] border-t border-border-card pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
                isActive ? "text-brand-primary" : "text-text-placeholder"
              }`}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {tab.name}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setIsSheetOpen((open) => !open)}
          className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
            isMoreActive || isSheetOpen ? "text-brand-primary" : "text-text-placeholder"
          }`}
        >
          <MoreHorizontal size={20} strokeWidth={isMoreActive || isSheetOpen ? 2.5 : 2} />
          Plus
        </button>
      </nav>
    </>
  );
}