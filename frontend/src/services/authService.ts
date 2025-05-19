import type { User } from "@/types";
import apiClient from "../lib/axios";
import type { LoginFormData, SignupFormData } from "../lib/zodSchemas";

interface AuthResponse {
  token: string;
}

export const loginUser = async (
  credentials: LoginFormData
): Promise<{ token: string }> => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );

  return { token: response.data.token };
};

export const signupUser = async (
  userData: SignupFormData
): Promise<{ token: string }> => {
  const { confirmPassword, ...payload } = userData; // eslint-disable-line @typescript-eslint/no-unused-vars
  const response = await apiClient.post<AuthResponse>("/auth/signup", payload);

  return { token: response.data.token };
};

export const currentUser = async (): Promise<{ user: User }> => {
  const response = await apiClient.get<User>("/auth/profile");

  return { user: response.data };
};
