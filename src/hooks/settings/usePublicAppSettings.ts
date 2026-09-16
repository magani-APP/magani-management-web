"use client";

import { useState } from "react";
import { PublicAppFeatureFlags, PublicAppSettings } from "@/types/public-app.types";
import { mockPublicAppSettings } from "@/mocks/public-app.mock";

export function usePublicAppSettings() {
  const [settings, setSettings] = useState<PublicAppSettings>(mockPublicAppSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const updateField = <K extends keyof PublicAppSettings>(field: K, value: PublicAppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const updateFeature = (feature: keyof PublicAppFeatureFlags, value: boolean) => {
    setSettings((prev) => ({ ...prev, features: { ...prev.features, [feature]: value } }));
  };

  const toggleOnline = () => {
    setSettings((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const save = async () => {
    setIsSaving(true);
    // Pas encore d'endpoint backend dédié : simulation d'un appel réseau.
    // À remplacer par `updatePublicAppSettings(settings)` (src/api/settings.api.ts)
    // dès que la route /pharmacy/public-app existera côté API.
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return {
    settings,
    updateField,
    updateFeature,
    toggleOnline,
    isSaving,
    justSaved,
    save,
  };
}
