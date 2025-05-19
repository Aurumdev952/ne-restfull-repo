import apiClient from "../lib/axios";
import type { LoginFormData, SignupFormData } from "../lib/zodSchemas";
import type { User } from "../types";

interface AuthResponse {
  token: string;
}

export const loginUser = async (
  credentials: LoginFormData
): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials
  );
  const user: User = {
    id: "mock_user_id_from_token_or_api",
    email: credentials.email,
  };
  return { token: response.data.token, user };
};

export const signupUser = async (
  userData: SignupFormData
): Promise<{ token: string; user: User }> => {
  const { confirmPassword, ...payload } = userData; // eslint-disable-line @typescript-eslint/no-unused-vars
  const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
  const user: User = {
    id: "mock_user_id_from_token_or_api",
    email: userData.email,
  };
  return { token: response.data.token, user };
};
