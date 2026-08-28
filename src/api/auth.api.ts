import { AuthUser, LoginInput, RegisterInput, ForgotPasswordInput } from "@/types/auth.types";

export type { AuthUser, LoginInput, RegisterInput, ForgotPasswordInput };

export const login = async ({ email }: LoginInput): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: "usr_1",
    name: "Alicha Kouamé",
    email,
  };
};

export const register = async ({
  fullName,
  email,
}: RegisterInput): Promise<AuthUser> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: "usr_1",
    name: fullName,
    email,
  };
};

export const requestPasswordReset = async ({
  email,
}: ForgotPasswordInput): Promise<{ success: true }> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return { success: true };
};