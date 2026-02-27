import React, { createContext, useContext, useState, ReactNode } from "react";
import { MockUser } from "./types";

interface AuthContextType {
  user: MockUser | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(() => {
    const saved = localStorage.getItem("mock_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = () => {
    const mockUser: MockUser = {
      name: "Sarah Mitchell",
      email: "sarah.mitchell@gmail.com",
      avatar: "SM",
    };
    setUser(mockUser);
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
