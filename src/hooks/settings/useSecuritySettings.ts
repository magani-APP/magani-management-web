"use client";

import { useEffect, useState } from "react";
import { SecuritySettings } from "@/types/settings";
import {
  disconnectAllSessions as disconnectAllSessionsApi,
  getSecuritySettings,
  updateTwoFactorStatus,
} from "@/api/settings.api";

export function useSecuritySettings() {
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getSecuritySettings().then((data) => {
      if (isMounted) {
        setSettings(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTwoFactor = async () => {
    if (!settings) return;

    const nextEnabled = !settings.twoFactorEnabled;

    // Mise à jour optimiste
    setSettings((prev) => (prev ? { ...prev, twoFactorEnabled: nextEnabled } : prev));

    try {
      await updateTwoFactorStatus(nextEnabled);
    } catch {
      // En cas d'échec, on restaure l'état précédent
      setSettings((prev) => (prev ? { ...prev, twoFactorEnabled: !nextEnabled } : prev));
    }
  };

  const disconnectAllSessions = async () => {
    setIsDisconnecting(true);
    try {
      await disconnectAllSessionsApi();
      setSettings((prev) =>
        prev ? { ...prev, activeSessionsCount: 1, activeSessionsDevices: "Cet appareil" } : prev
      );
    } finally {
      setIsDisconnecting(false);
    }
  };

  return {
    settings,
    isLoading,
    isDisconnecting,
    toggleTwoFactor,
    disconnectAllSessions,
  };
}
