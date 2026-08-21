import { PharmacySettings, PaymentMethod, SecuritySettings, StockSetting, TeamMember } from "@/types/settings";

export const mockPharmacySettings: PharmacySettings = {
  name: "Pharmacie Centrale d'Abidjan",
  licenseNumber: "PHA-CI-2019-0847",
  address: "Rue du Commerce, Plateau, Abidjan",
  phone: "+225 27 22 43 XX XX",
  email: "contact@pharmaciecentrale.ci",
  hours: "Lun–Sam 8h–20h · Dim 9h–13h",
};

export const mockTeamMembers: TeamMember[] = [
  {
    id: "usr_kofi_diallo",
    name: "Dr. Kofi Diallo",
    email: "k.diallo@pharmac.ci",
    role: "Propriétaire",
    status: "active",
  },
  {
    id: "usr_aminata_kouassi",
    name: "Aminata Kouassi",
    email: "a.kouassi@pharmac.ci",
    role: "Pharmacienne",
    status: "active",
  },
  {
    id: "usr_ibrahim_traore",
    name: "Ibrahim Traoré",
    email: "i.traore@pharmac.ci",
    role: "Caissier",
    status: "active",
  },
  {
    id: "usr_fatou_bamba",
    name: "Fatou Bamba",
    email: "f.bamba@pharmac.ci",
    role: "Gestionnaire stock",
    status: "inactive",
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm_cash",
    name: "Espèces",
    description: "Toujours activé — paiement de base",
    icon: "cash",
    isFixed: true,
    enabled: true,
  },
  {
    id: "pm_mtn_momo",
    name: "MTN Mobile Money",
    description: "Paiements via *126# · Abonnement 5 000 F/mois",
    icon: "mtn",
    isFixed: false,
    enabled: true,
  },
  {
    id: "pm_orange_money",
    name: "Orange Money",
    description: "Paiements via #144# · Abonnement 4 500 F/mois",
    icon: "orange",
    isFixed: false,
    enabled: true,
  },
];

export const mockStockSettings: StockSetting[] = [
  {
    id: "stock_low_alert",
    label: "Alertes stock bas",
    description: "Notification quand le stock passe sous le seuil minimum défini",
    enabled: true,
  },
  {
    id: "stock_expiry_alert",
    label: "Alertes d'expiration",
    description: "Alerte automatique 60 jours avant la date d'expiration",
    enabled: true,
  },
  {
    id: "stock_auto_backup",
    label: "Sauvegarde automatique",
    description: "Sauvegarde quotidienne des données stock à 23h00",
    enabled: true,
  },
];

export const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  activeSessionsCount: 2,
  activeSessionsDevices: "MacBook Pro, iPhone 15",
};
