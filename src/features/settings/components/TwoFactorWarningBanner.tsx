import { AlertCircle } from "lucide-react";

export function TwoFactorWarningBanner() {
  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
      <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-bold text-amber-800">2FA non activé</p>
        <p className="text-[10px] text-amber-700 mt-0.5 leading-snug font-medium">
          Nous recommandons d&apos;activer la double authentification pour protéger l&apos;accès à
          vos données.
        </p>
      </div>
    </div>
  );
}
