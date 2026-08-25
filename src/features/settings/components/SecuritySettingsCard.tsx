"use client";

import { useSecuritySettings } from "@/hooks/settings/useSecuritySettings";
import { Toggle } from "./Toggle";
import { TwoFactorWarningBanner } from "./TwoFactorWarningBanner";

export function SecuritySettingsCard() {
  const { settings, isLoading, isDisconnecting, toggleTwoFactor, disconnectAllSessions } =
    useSecuritySettings();

  return (
    <div className="max-w-xl space-y-5">
      {/* En-tête */}
      <div>
        <h2 className="text-base font-bold text-[#0F1A15]">Sécurité</h2>
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
          {!settings.twoFactorEnabled && <TwoFactorWarningBanner />}

          <div className="bg-white rounded-2xl border border-[#E8EDEA] overflow-hidden divide-y divide-[#F0F5F2]">
            {/* Double authentification */}
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFA] transition-colors">
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0F1A15]">
                  Double authentification (2FA)
                </p>
                <p className="text-[10px] text-[#9AAEA3] mt-0.5 font-medium">
                  Code OTP par SMS à chaque connexion
                </p>
              </div>
              <Toggle
                checked={settings.twoFactorEnabled}
                onChange={toggleTwoFactor}
                label="Double authentification"
              />
            </div>

            {/* Sessions actives */}
            <div className="flex items-center gap-4 px-5 py-4 hover:bg-[#F9FBFA] transition-colors">
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
                className="text-xs font-bold text-red-500 hover:underline disabled:opacity-60 transition-colors"
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
