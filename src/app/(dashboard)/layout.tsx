import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MagaWidget } from "@/features/maga/components/MagaWidget";
import { getCurrentUser, getPharmacyInfo } from "@/api/core.api";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, pharmacy] = await Promise.all([
    getCurrentUser(),
    getPharmacyInfo(),
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={user} pharmacy={pharmacy} />

      <main className="flex flex-col flex-1 ml-[240px] h-full overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-auto no-scrollbar">
          {children}
        </div>
      </main>
      <MagaWidget />
    </div>
  );
}
