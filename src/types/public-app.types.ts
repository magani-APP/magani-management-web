export type PublicAppTabId = "general" | "products" | "reservations" | "info" | "preview";

export type PublicAppPreviewDevice = "mobile" | "desktop";

export interface PublicAppFeatureFlags {
  catalog: boolean;
  reservations: boolean;
  info: boolean;
}

export interface PublicAppSettings {
  isOnline: boolean;
  /** Utilisé pour construire le lien public : https://pharmaos.cm/{slug} */
  slug: string;
  pharmacyName: string;
  primaryColor: string;
  secondaryColor: string;
  features: PublicAppFeatureFlags;
}

export interface PublicAppPreviewProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  swatch: string;
}

export interface PublicAppPreviewCategory {
  id: string;
  label: string;
  icon: "pill" | "syringe" | "vitamin" | "care";
}
