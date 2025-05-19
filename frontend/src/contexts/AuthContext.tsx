import React, { createContext, useEffect, useState, type ReactNode } from "react";
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
        // const decodedToken = jwtDecode(token); // Example with jwt-decode
        // const user = { id: decodedToken.sub, email: decodedToken.email };
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          setAuthState({
            token,
            user: JSON.parse(storedUser),
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

  const handleAuthSuccess = (token: string, user: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    setAuthState({ token, user, isLoading: false, isAuthenticated: true });
  };

  const login = (token: string, user: User) => {
    handleAuthSuccess(token, user);
  };

  const signup = (token: string, user: User) => {
    handleAuthSuccess(token, user);
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
