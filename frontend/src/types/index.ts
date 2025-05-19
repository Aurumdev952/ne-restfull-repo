export type UserRole = "ADMIN" | "USER"; // Define possible roles


export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string) => void;
  logout: () => void;
  signup: (token: string) => void; // Similar to login for now
}
