import { createContext, useState, type ReactNode } from "react";

type AuthContextType = {
  userId: string | null;
  isLoggedIn: boolean;
  login: (userId: string) => void;
  logout: () => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  isLoggedIn: false,
  login: () => {
    throw new Error("login function must be overridden by provider");
  },
  logout: () => {
    throw new Error("logout function must be overridden by provider");
  },
});

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userId: string) => {
    setUserId(userId);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
