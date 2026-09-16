export type IntegrationCategory = "payments" | "stock" | "communication" | "delivery";

export type IntegrationTabId = "all" | IntegrationCategory;

export type IntegrationStatus =
  | "operational"
  | "not-connected"
  | "available"
  | "needs-attention"
  | "not-configured"
  | "not-installed"
  | "coming-soon";

export type IntegrationIconType =
  | "smartphone"
  | "phone"
  | "file-text"
  | "database"
  | "monitor"
  | "message-circle"
  | "mail"
  | "package";

export type IntegrationCtaLabel = "Configurer" | "Connecter" | "Importer" | "Installer";

export interface Integration {
  id: string;
  category: IntegrationCategory;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: IntegrationIconType;
  iconColor: string;
  /** Ligne méta optionnelle ("Dernière synchro : ..." / "Dernière activité : ..."). */
  metaLabel?: string;
  ctaLabel?: IntegrationCtaLabel;
  /** Affiche un second lien discret "Voir les détails" avant le CTA (cas MTN Mobile Money). */
  hasDetailsLink?: boolean;
  /** Composant de configuration dédié (ex: MTN Mobile Money) plutôt que le tiroir générique. */
  hasCustomConfig?: boolean;
}
