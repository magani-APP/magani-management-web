import { PublicAppPreviewCategory, PublicAppPreviewProduct, PublicAppSettings } from "@/types/public-app.types";

export const mockPublicAppSettings: PublicAppSettings = {
  isOnline: true,
  slug: "pharmacie-centrale",
  pharmacyName: "Pharmacie Centrale",
  primaryColor: "#16A34A",
  secondaryColor: "#D1FAE5",
  features: {
    catalog: true,
    reservations: true,
    info: true,
  },
};

export const mockPublicAppPreviewCategories: PublicAppPreviewCategory[] = [
  { id: "antalgiques", label: "Antalgiques", icon: "pill" },
  { id: "antibiotiques", label: "Antibiotiques", icon: "syringe" },
  { id: "vitamines", label: "Vitamines", icon: "vitamin" },
  { id: "soins", label: "Soins perso.", icon: "care" },
];

export const mockPublicAppPreviewProducts: PublicAppPreviewProduct[] = [
  { id: "doliprane", name: "Doliprane 1000mg", subtitle: "32 comprimés", price: 1200, swatch: "#FEF3C7" },
  { id: "amoxicilline", name: "Amoxicilline 500mg", subtitle: "30 gélules", price: 2500, swatch: "#DBEAFE" },
];
