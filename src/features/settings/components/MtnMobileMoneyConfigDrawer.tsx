"use client";

import { useState } from "react";
import { X, Eye, EyeOff, RotateCw, CheckCircle2, Info, Check } from "lucide-react";
import { TOKENS } from "@/constants/design-tokens.constants";
import { Integration } from "@/types/integrations.types";
import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationStatusBadge } from "./IntegrationStatusBadge";

interface MtnMobileMoneyConfigDrawerProps {
  integration: Integration;
  onClose: () => void;
}

const CONFIG_TABS = ["Configuration", "Historique", "Aide"] as const;

function MaskedField({ label, value }: { label: string; value: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: TOKENS.faintText }}>
        {label}
      </label>
      <div
        className="flex items-center justify-between mt-1.5 px-3 py-2.5 rounded-xl border bg-[#F9FBFA]"
        style={{ borderColor: TOKENS.borderCard }}
      >
        <span className="text-xs font-semibold tracking-wider" style={{ color: TOKENS.foreground }}>
          {revealed ? value : "•".repeat(Math.max(5, value.length - 4)) + value.slice(-4)}
        </span>
        <button
          type="button"
          onClick={() => setRevealed((prev) => !prev)}
          className="text-[#9AAEA3] hover:text-[#6B7A6F] transition-colors"
          aria-label={revealed ? "Masquer" : "Afficher"}
        >
          {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function SettingsCheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2.5 w-full text-left py-1.5"
    >
      <span
        className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 border transition-colors"
        style={
          checked
            ? { background: "rgb(11, 143, 104)", borderColor: "rgb(11, 143, 104)" }
            : { background: "#fff", borderColor: TOKENS.borderCard }
        }
      >
        {checked && <Check size={11} className="text-white" strokeWidth={3} />}
      </span>
      <span className="text-xs font-medium" style={{ color: TOKENS.secondaryText }}>
        {label}
      </span>
    </button>
  );
}

export function MtnMobileMoneyConfigDrawer({ integration, onClose }: MtnMobileMoneyConfigDrawerProps) {
  const [activeTab, setActiveTab] = useState<(typeof CONFIG_TABS)[number]>("Configuration");
  const [usageSettings, setUsageSettings] = useState({
    acceptAtCashier: true,
    acceptForReservations: true,
    autoVerifyTransactions: true,
  });
  const [notificationSettings, setNotificationSettings] = useState({
    notifyOnFailure: true,
    dailyEmailReport: false,
  });

  const toggleUsage = (key: keyof typeof usageSettings) =>
    setUsageSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleNotification = (key: keyof typeof notificationSettings) =>
    setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <div className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]" onClick={onClose} />
      <aside
        className="fixed inset-x-0 bottom-0 z-40 max-h-[92vh] rounded-t-3xl border shadow-[0_-8px_32px_rgba(0,0,0,0.12)] lg:static lg:z-auto lg:inset-auto lg:max-h-none lg:w-[360px] xl:w-[380px] lg:flex-shrink-0 lg:rounded-2xl lg:shadow-none overflow-y-auto no-scrollbar flex flex-col bg-white"
        style={{ borderColor: TOKENS.borderCard }}
      >
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b" style={{ borderColor: TOKENS.divider }}>
          <h3 className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
            Configurer {integration.name}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#F0F5F2] transition-colors"
            style={{ color: TOKENS.faintText }}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pt-4">
          {/* RÉSUMÉ */}
          <div className="flex items-start gap-3">
            <IntegrationIcon type={integration.icon} color={integration.iconColor} size={36} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold" style={{ color: TOKENS.foreground }}>
                  {integration.name}
                </p>
                <IntegrationStatusBadge status={integration.status} />
              </div>
              <p className="text-[11px] font-medium mt-0.5" style={{ color: TOKENS.faintText }}>
                Connecté depuis le 14 janv. 2026
              </p>
            </div>
          </div>

          {/* ONGLETS */}
          <div className="flex items-center gap-4 mt-4 border-b" style={{ borderColor: TOKENS.divider }}>
            {CONFIG_TABS.map((tab) => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="text-xs font-bold pb-2.5 -mb-px border-b-2 transition-colors"
                  style={{
                    color: isActive ? "rgb(11, 143, 104)" : TOKENS.faintText,
                    borderColor: isActive ? "rgb(11, 143, 104)" : "transparent",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {activeTab === "Configuration" && (
            <>
              {/* COMPTE MARCHAND */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.07em]" style={{ color: TOKENS.faintText }}>
                  Compte marchand
                </h4>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: TOKENS.faintText }}>
                    Nom de la pharmacie
                  </label>
                  <div
                    className="mt-1.5 px-3 py-2.5 rounded-xl border bg-[#F9FBFA] text-xs font-semibold"
                    style={{ borderColor: TOKENS.borderCard, color: TOKENS.foreground }}
                  >
                    Pharmacie Centrale
                  </div>
                </div>

                <MaskedField label="Numéro marchand" value="0700002847" />
                <MaskedField label="Clé API" value="sk_live_mtn_9f27ac4e21bd" />
              </div>

              {/* CONNEXION ACTIVE */}
              <div className="p-3 rounded-xl" style={{ background: "#E3F9EE" }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} style={{ color: "#059669" }} />
                  <span className="text-xs font-bold" style={{ color: "#059669" }}>
                    Connexion active
                  </span>
                </div>
                <p className="text-[10px] font-medium mt-1 ml-[23px]" style={{ color: "#059669" }}>
                  Dernière synchronisation : aujourd&apos;hui à 10:32
                </p>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[10px] font-bold mt-1.5 ml-[23px] hover:underline"
                  style={{ color: "#059669" }}
                >
                  <RotateCw size={11} />
                  Tester la connexion
                </button>
              </div>

              {/* PARAMÈTRES D'UTILISATION */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-1.5" style={{ color: TOKENS.faintText }}>
                  Paramètres d&apos;utilisation
                </h4>
                <div className="space-y-0.5">
                  <SettingsCheckboxRow
                    label="Accepter MTN MoMo à la caisse"
                    checked={usageSettings.acceptAtCashier}
                    onChange={() => toggleUsage("acceptAtCashier")}
                  />
                  <SettingsCheckboxRow
                    label="Accepter MTN MoMo pour les réservations"
                    checked={usageSettings.acceptForReservations}
                    onChange={() => toggleUsage("acceptForReservations")}
                  />
                  <SettingsCheckboxRow
                    label="Vérifier automatiquement les transactions"
                    checked={usageSettings.autoVerifyTransactions}
                    onChange={() => toggleUsage("autoVerifyTransactions")}
                  />
                </div>
              </div>

              {/* NOTIFICATIONS */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.07em] mb-1.5" style={{ color: TOKENS.faintText }}>
                  Notifications
                </h4>
                <div className="space-y-0.5">
                  <SettingsCheckboxRow
                    label="Me notifier en cas d'échec de transaction"
                    checked={notificationSettings.notifyOnFailure}
                    onChange={() => toggleNotification("notifyOnFailure")}
                  />
                  <SettingsCheckboxRow
                    label="Recevoir un rapport quotidien par e-mail"
                    checked={notificationSettings.dailyEmailReport}
                    onChange={() => toggleNotification("dailyEmailReport")}
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "#EFF6FF" }}>
                <Info size={14} style={{ color: "#1D4ED8" }} className="flex-shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium" style={{ color: "#1D4ED8" }}>
                  Les paiements reçus seront automatiquement réconciliés avec les ventes et réservations.
                </p>
              </div>
            </>
          )}

          {activeTab === "Historique" && (
            <p className="text-xs font-medium py-8 text-center" style={{ color: TOKENS.faintText }}>
              L&apos;historique des transactions MTN MoMo s&apos;affichera ici.
            </p>
          )}

          {activeTab === "Aide" && (
            <p className="text-xs font-medium py-8 text-center" style={{ color: TOKENS.faintText }}>
              Consultez la documentation MTN Mobile Money pour toute question.
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 px-5 py-4 border-t" style={{ borderColor: TOKENS.divider }}>
          <button
            type="button"
            className="flex-1 px-3 py-2.5 rounded-2xl border text-xs font-bold transition-colors hover:bg-red-50"
            style={{ borderColor: "#FBD1D1", color: "#DC2626" }}
          >
            Déconnecter
          </button>
          <button
            type="button"
            className="flex-1 px-3 py-2.5 rounded-2xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
            style={{ background: "rgb(11, 143, 104)" }}
          >
            Enregistrer
          </button>
        </div>
      </aside>
    </>
  );
}
