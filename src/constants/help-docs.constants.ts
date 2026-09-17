export interface HelpQuickLink {
  id: string;
  title: string;
  description: string;
  icon: "guides" | "videos" | "faq" | "support";
}

export const HELP_QUICK_LINKS: HelpQuickLink[] = [
  { id: "guides", title: "Guides d'utilisation", description: "Tutoriels pas à pas pour maîtriser PharmaOS", icon: "guides" },
  { id: "videos", title: "Vidéos tutoriels", description: "Apprenez en vidéo", icon: "videos" },
  { id: "faq", title: "Questions fréquentes", description: "Réponses aux questions courantes", icon: "faq" },
  { id: "support", title: "Assistance", description: "Contactez notre équipe", icon: "support" },
];

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
}

export const HELP_POPULAR_ARTICLES: HelpArticle[] = [
  { id: "start", title: "Démarrer avec PharmaOS", description: "Configuration initiale et premières étapes" },
  { id: "stock", title: "Gérer votre stock de médicaments", description: "Ajout de produits, alertes et inventaire" },
  { id: "pos", title: "Utiliser la caisse POS", description: "Effectuer une vente et gérer les paiements" },
  { id: "users", title: "Configurer les utilisateurs", description: "Rôles et permissions de votre équipe" },
  { id: "backup", title: "Sauvegarder vos données", description: "Sécurité et export de vos informations" },
];

export interface HelpCategory {
  id: string;
  title: string;
  count: number;
  icon: "start" | "stock" | "pos" | "reports" | "settings" | "security" | "mobile" | "integrations";
}

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: "start", title: "Premiers pas", count: 8, icon: "start" },
  { id: "stock", title: "Produits & Stock", count: 12, icon: "stock" },
  { id: "pos", title: "Caisse POS", count: 10, icon: "pos" },
  { id: "reports", title: "Rapports", count: 6, icon: "reports" },
  { id: "settings", title: "Paramètres", count: 8, icon: "settings" },
  { id: "security", title: "Sécurité", count: 5, icon: "security" },
  { id: "mobile", title: "Application mobile", count: 4, icon: "mobile" },
  { id: "integrations", title: "Intégrations", count: 3, icon: "integrations" },
];
