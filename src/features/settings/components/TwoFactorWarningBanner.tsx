import { AlertCircle } from "lucide-react";

interface TwoFactorWarningBannerProps {
  onEnable: () => void;
}

export function TwoFactorWarningBanner({ onEnable }: TwoFactorWarningBannerProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
        <AlertCircle size={16} className="text-amber-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-amber-800">2FA non activé</p>
        <p className="text-[10px] text-amber-700 mt-0.5 leading-snug font-medium">
          Nous recommandons d&apos;activer la double authentification pour protéger l&apos;accès à
          vos données.
        </p>
      </div>
      <button
        type="button"
        onClick={onEnable}
        className="flex-shrink-0 px-4 py-2 rounded-3xl text-xs font-bold text-amber-800 bg-white border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap"
      >
        Activer maintenant
      </button>
    </div>
  );
}
