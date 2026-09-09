import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "@/types";
import { mockAdmin, mockCandidate } from "@/mocks/users.mock";

interface SessionContextType {
  user: User | null;
  login: (role: "CANDIDATE" | "ADMIN") => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: "CANDIDATE" | "ADMIN") => {
    if (role === "ADMIN") {
      setUser(mockAdmin);
    } else {
      setUser(mockCandidate);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: SessionContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useMockSession(): SessionContextType {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useMockSession must be used within a MockSessionProvider");
  }
  return context;
}
