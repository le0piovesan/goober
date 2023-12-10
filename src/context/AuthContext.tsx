import { useRouter } from "next/router";
import { createContext, useState, type ReactNode } from "react";

type AuthContextType = {
  userId: number | null;
  isLoggedIn: boolean;
  login: (userId: number) => Promise<void>;
  logout: () => Promise<void>;
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
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const login = async (userId: number) => {
    console.log("Logging in with user id: ", userId);
    setUserId(userId);
    setIsLoggedIn(true);
    await router.push("/rides/feed");
  };

  const logout = async () => {
    setUserId(null);
    setIsLoggedIn(false);
    await router.push("/");
  };

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
