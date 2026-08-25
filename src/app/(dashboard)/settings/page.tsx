"use client";

import { Suspense } from "react";
import { Bell, Globe, Printer, Receipt, Zap } from "lucide-react";
import { useSettings } from "@/hooks/settings/useSettings";
import { SettingsLayout } from "@/features/settings/components/SettingsLayout";
import { PharmacySettingsCard } from "@/features/settings/components/PharmacySettingsCard";
import { TeamSettingsCard } from "@/features/settings/components/TeamSettingsCard";
import { PaymentsSettingsCard } from "@/features/settings/components/PaymentsSettingsCard";
import { StockSettingsCard } from "@/features/settings/components/StockSettingsCard";
import { SecuritySettingsCard } from "@/features/settings/components/SecuritySettingsCard";
import { ComingSoonCard } from "@/features/settings/components/ComingSoonCard";
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
    if (activeTab === "team") {
      return <TeamSettingsCard />;
    }

    if (activeTab === "pos") {
      return (
        <ComingSoonCard
          key={activeTab}
          icon={<Receipt size={20} />}
          title="Caisse"
          description="Cette section est en cours de configuration et sera disponible dans la prochaine mise à jour."
        />
      );
    }

    if (activeTab === "payments") {
      return <PaymentsSettingsCard />;
    }

    if (activeTab === "stock") {
      return <StockSettingsCard />;
    }

    if (activeTab === "notifications") {
      return (
        <ComingSoonCard
          key={activeTab}
          icon={<Bell size={20} />}
          title="Notifications"
          description="Cette section est en cours de configuration et sera disponible dans la prochaine mise à jour."
        />
      );
    }

    if (activeTab === "receipts") {
      return (
        <ComingSoonCard
          key={activeTab}
          icon={<Printer size={20} />}
          title="Tickets & Reçus"
          description="Cette section est en cours de configuration et sera disponible dans la prochaine mise à jour."
        />
      );
    }

    if (activeTab === "integrations") {
      return (
        <ComingSoonCard
          key={activeTab}
          icon={<Zap size={20} />}
          title="Intégrations"
          description="Cette section est en cours de configuration et sera disponible dans la prochaine mise à jour."
        />
      );
    }

    if (activeTab === "public-app") {
      return (
        <ComingSoonCard
          key={activeTab}
          icon={<Globe size={20} />}
          title="App publique"
          description="Cette section est en cours de configuration et sera disponible dans la prochaine mise à jour."
        />
      );
    }

    if (activeTab === "security") {
      return <SecuritySettingsCard />;
    }

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
