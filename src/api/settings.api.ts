import { mockPharmacySettings } from "@/mocks/settings.mock";
import { PharmacySettings } from "@/types/settings";

export type { PharmacySettings };

export const getPharmacySettings = async (): Promise<PharmacySettings> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPharmacySettings;
};

export const updatePharmacySettings = async (
  data: PharmacySettings
): Promise<PharmacySettings> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return data;
};
