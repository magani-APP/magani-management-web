import { mockCurrentUser, mockPharmacy, User, Pharmacy } from "../mocks/core.mock";

export type { User, Pharmacy };

export const getCurrentUser = async (): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockCurrentUser;
};

export const getPharmacyInfo = async (): Promise<Pharmacy> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockPharmacy;
};
