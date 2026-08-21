"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SettingsTabId } from "@/types/settings";
import {
  PharmacySettings,
  getPharmacySettings,
  updatePharmacySettings,
} from "@/api/settings.api";

export function useSettings() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as SettingsTabId | null;
  const activeTab: SettingsTabId = tabParam || "pharmacy";

  const [pharmacy, setPharmacy] = useState<PharmacySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getPharmacySettings().then((data) => {
      if (isMounted) {
        setPharmacy(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const updateField = (field: keyof PharmacySettings, value: string) => {
    setPharmacy((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const save = async () => {
    if (!pharmacy) return;
    setIsSaving(true);
    await updatePharmacySettings(pharmacy);
    setIsSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return {
    activeTab,
    pharmacy,
    isLoading,
    isSaving,
    justSaved,
    updateField,
    save,
  };
}
