"use client";

import { Suspense } from "react";
import { useSettings } from "@/hooks/settings/useSettings";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";
import { PharmacySettingsCard } from "@/features/settings/components/PharmacySettingsCard";
import { SettingsPlaceholder } from "@/features/settings/components/SettingsPlaceholder";
import { SETTINGS_TABS } from "@/constants/settings.constants";

function SettingsContent() {
  const {
    activeTab,
    pharmacy,
    isLoading,
    isSaving,
    justSaved,
    updateField,
    save,
  } = useSettings();

  const renderActiveTab = () => {
    if (activeTab !== "pharmacy") {
      const tabLabel = SETTINGS_TABS.find((tab) => tab.id === activeTab)?.label ?? "";
      return <SettingsPlaceholder label={tabLabel} />;
    }

    if (isLoading || !pharmacy) {
      return (
        <div className="flex h-full min-h-[400px] items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <PharmacySettingsCard
        data={pharmacy}
        onChange={updateField}
        onSave={save}
        isSaving={isSaving}
        justSaved={justSaved}
      />
    );
  };

  return <SettingsLayout activeTab={activeTab}>{renderActiveTab()}</SettingsLayout>;
}

export default function SettingsPage() {
  return (
    <div className="h-full bg-background overflow-hidden">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <SettingsContent />
      </Suspense>
    </div>
  );
}
