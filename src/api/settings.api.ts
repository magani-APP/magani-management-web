import {
  mockPharmacySettings,
  mockPaymentMethods,
  mockSecuritySettings,
  mockStockSettings,
  mockTeamMembers,
} from "@/mocks/settings.mock";
import {
  PaymentMethod,
  PharmacySettings,
  SecuritySettings,
  StockSetting,
  TeamMember,
  TeamMemberStatus,
} from "@/types/settings";

export type { PaymentMethod, PharmacySettings, SecuritySettings, StockSetting, TeamMember, TeamMemberStatus };

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

export interface InviteTeamMemberInput {
  name: string;
  email: string;
  role: string;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockTeamMembers;
};

export const inviteTeamMember = async (
  input: InviteTeamMemberInput
): Promise<TeamMember> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: `usr_${Date.now()}`,
    name: input.name,
    email: input.email,
    role: input.role,
    status: "active",
  };
};

export const updateTeamMemberStatus = async (
  id: string,
  status: TeamMemberStatus
): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const removeTeamMember = async (id: string): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPaymentMethods;
};

export const updatePaymentMethodStatus = async (
  id: string,
  enabled: boolean
): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const getStockSettings = async (): Promise<StockSetting[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockStockSettings;
};

export const updateStockSetting = async (id: string, enabled: boolean): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
};

export const getSecuritySettings = async (): Promise<SecuritySettings> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockSecuritySettings;
};

export const updateTwoFactorStatus = async (enabled: boolean): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));
};

export const disconnectAllSessions = async (): Promise<void> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
};
