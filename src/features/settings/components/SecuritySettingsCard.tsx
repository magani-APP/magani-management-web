"use client";

import { ShieldCheck, Monitor } from "lucide-react";
import { useSecuritySettings } from "@/hooks/settings/useSecuritySettings";
import { Toggle } from "./Toggle";
import { TwoFactorWarningBanner } from "./TwoFactorWarningBanner";

export function SecuritySettingsCard() {
  const { settings, isLoading, isDisconnecting, toggleTwoFactor, disconnectAllSessions } =
    useSecuritySettings();

  return (
    <div className="w-full space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-[20px] font-bold text-[#0F1A15]">Sécurité</h2>
        <p className="text-xs text-[#9AAEA3] mt-1 font-medium">
          Authentification et accès au compte.
        </p>
      </div>

      {isLoading || !settings ? (
        <div className="flex h-[220px] items-center justify-center rounded-2xl border border-[#E8EDEA] bg-white">
          <div className="w-8 h-8 border-4 border-[#0B8F68] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* La bannière disparaît dès que le 2FA est activé */}
          {!settings.twoFactorEnabled && (
            <TwoFactorWarningBanner onEnable={toggleTwoFactor} />
          )}

          <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
            {/* Double authentification */}
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FBFA] transition-colors">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(11, 143, 104, 0.08)", color: "rgb(11, 143, 104)" }}
              >
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0F1A15]">
                  Double authentification (2FA)
                </p>
                <p className="text-[10px] text-[#9AAEA3] mt-0.5 font-medium">
                  Code OTP par SMS à chaque connexion
                </p>
              </div>
              <div className="text-right mr-2 hidden sm:block">
                <p className="text-[10px] font-bold text-[#9AAEA3]">
                  {settings.twoFactorEnabled ? "Activé" : "Désactivé"}
                </p>
                <p className="text-[9px] text-[#C8D5CC] font-medium">
                  {settings.twoFactorEnabled
                    ? "Protection renforcée"
                    : "Activez pour renforcer la sécurité de votre compte"}
                </p>
              </div>
              <Toggle
                checked={settings.twoFactorEnabled}
                onChange={toggleTwoFactor}
                label="Double authentification"
              />
            </div>

            {/* Sessions actives */}
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FBFA] transition-colors">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(59, 130, 246, 0.1)", color: "rgb(59, 130, 246)" }}
              >
                <Monitor size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0F1A15]">Sessions actives</p>
                <p className="text-[10px] text-[#9AAEA3] mt-0.5 font-medium">
                  {settings.activeSessionsCount} appareils connectés · {settings.activeSessionsDevices}
                </p>
              </div>
              <button
                type="button"
                onClick={disconnectAllSessions}
                disabled={isDisconnecting}
                className="text-xs font-bold text-red-500 hover:underline disabled:opacity-60 transition-colors whitespace-nowrap"
              >
                {isDisconnecting ? "Déconnexion..." : "Tout déconnecter"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
