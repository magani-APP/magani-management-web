import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MagaWidget } from "@/features/maga/components/MagaWidget";
import { getMe } from "@/api/auth.api";
import { mapCurrentUser, mapPharmacyInfo } from "@/api/core.api";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth-session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    redirect("/login");
  }

  let user;
  let pharmacy;
  try {
    const profile = await getMe(accessToken, refreshToken);
    user = mapCurrentUser(profile);
    pharmacy = mapPharmacyInfo(profile);
  } catch {
    redirect("/login");
  }

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
