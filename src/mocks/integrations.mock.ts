import { Integration } from "@/types/integrations.types";

export const INTEGRATIONS: Integration[] = [
  // Paiements
  {
    id: "mtn-momo",
    category: "payments",
    name: "MTN Mobile Money",
    description: "Recevez et vérifiez automatiquement les paiements MTN MoMo effectués depuis PharmaOS.",
    status: "operational",
    icon: "smartphone",
    iconColor: "#F5A623",
    metaLabel: "Dernière synchro : Il y a 4 min",
    ctaLabel: "Configurer",
    hasDetailsLink: true,
    hasCustomConfig: true,
  },
  {
    id: "orange-money",
    category: "payments",
    name: "Orange Money",
    description: "Connectez le compte marchand Orange Money de votre pharmacie.",
    status: "not-connected",
    icon: "phone",
    iconColor: "#FF6200",
    ctaLabel: "Connecter",
  },

  // Stock & données
  {
    id: "import-csv",
    category: "stock",
    name: "Import Excel / CSV",
    description: "Importez vos produits, stocks, prix et inventaires depuis un fichier.",
    status: "available",
    icon: "file-text",
    iconColor: "#0B8F68",
    ctaLabel: "Importer",
  },
  {
    id: "pharmacy-api",
    category: "stock",
    name: "Logiciel de pharmacie / API",
    description: "Synchronisez PharmaOS avec votre logiciel de gestion actuel via une connexion sécurisée.",
    status: "needs-attention",
    icon: "database",
    iconColor: "#0B8F68",
    metaLabel: "Dernière activité : Il y a 7 h",
    ctaLabel: "Configurer",
  },
  {
    id: "local-connector",
    category: "stock",
    name: "Connecteur local PharmaOS",
    description: "Synchronisez automatiquement les stocks depuis un ordinateur de la pharmacie.",
    status: "not-installed",
    icon: "monitor",
    iconColor: "#0B8F68",
    ctaLabel: "Installer",
  },

  // Communication
  {
    id: "whatsapp",
    category: "communication",
    name: "WhatsApp Business",
    description: "Envoyez les confirmations de réservation, notifications de retrait et messages aux clients.",
    status: "operational",
    icon: "message-circle",
    iconColor: "#25D366",
    metaLabel: "Dernière synchro : Aujourd'hui à 08:14",
    ctaLabel: "Configurer",
  },
  {
    id: "email",
    category: "communication",
    name: "E-mail",
    description: "Envoyez automatiquement les tickets, reçus et notifications de la pharmacie.",
    status: "not-configured",
    icon: "mail",
    iconColor: "#6366F1",
    ctaLabel: "Configurer",
  },

  // Livraison
  {
    id: "delivery-partner",
    category: "delivery",
    name: "Partenaire de livraison",
    description: "Connectez un partenaire pour transmettre les commandes validées et suivre leur livraison.",
    status: "coming-soon",
    icon: "package",
    iconColor: "#94A3AF",
  },
];
