"use client";

import { useEffect, useState } from "react";
import { StockSetting } from "@/types/settings";
import { getStockSettings, updateStockSetting } from "@/api/settings.api";

export function useStockSettings() {
  const [settings, setSettings] = useState<StockSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getStockSettings().then((data) => {
      if (isMounted) {
        setSettings(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const toggle = async (id: string) => {
    const target = settings.find((setting) => setting.id === id);
    if (!target) return;

    const nextEnabled = !target.enabled;

    // Mise à jour optimiste
    setSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: nextEnabled } : setting))
    );

    try {
      await updateStockSetting(id, nextEnabled);
    } catch {
      // En cas d'échec, on restaure l'état précédent
      setSettings((prev) =>
        prev.map((setting) => (setting.id === id ? { ...setting, enabled: target.enabled } : setting))
      );
    }
  };

  return { settings, isLoading, toggle };
}
