import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import apiClient from "../lib/axios";
import type { AuthContextType, AuthState, User } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem("authToken"),
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // Here you might want to validate the token with a /me endpoint
      // For now, we assume token presence means authenticated
      // and parse user info from token or fetch it
      // For simplicity, we'll just set a mock user if token exists
      // In a real app, decode JWT or fetch user data
      try {
        const decodedToken = jwtDecode(token) as User;

        if (decodedToken) {
          setAuthState({
            token,
            user: decodedToken,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            token: null,
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setAuthState({
          token: null,
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setAuthState({
        token: null,
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem("authToken", token);
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    const dekodedToken = jwtDecode(token) as User;
    setAuthState({
      token,
      user: dekodedToken,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const login = (token: string) => {
    handleAuthSuccess(token);
  };

  const signup = (token: string) => {
    handleAuthSuccess(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    delete apiClient.defaults.headers.Authorization;
    setAuthState({
      token: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
