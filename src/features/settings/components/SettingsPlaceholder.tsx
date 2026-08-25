interface SettingsPlaceholderProps {
  label: string;
}

export function SettingsPlaceholder({ label }: SettingsPlaceholderProps) {
  return (
    <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-border-main rounded-2xl bg-surface-alt/50">
      <p className="text-text-muted text-[12px] font-medium">
        Contenu « {label} » (Non implémenté dans ce périmètre)
      </p>
    </div>
  );
}
