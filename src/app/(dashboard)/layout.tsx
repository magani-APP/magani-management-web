import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardMain } from "@/components/layout/DashboardMain";
import { MagaWidget } from "@/features/maga/components/MagaWidget";
import { getMe } from "@/api/auth.api";
import { mapCurrentUser, mapPharmacyInfo } from "@/api/core.api";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth-session";
import { isAuthFailure } from "@/lib/api-client";

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
  } catch (error) {
    if (isAuthFailure(error)) {
      redirect("/login");
    }
    user = { id: "", name: "…", role: "", initials: "…" };
    pharmacy = { id: "", name: "Magani" };
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar user={user} pharmacy={pharmacy} />
      <DashboardMain>{children}</DashboardMain>
      <MagaWidget />
    </div>
  );
}
