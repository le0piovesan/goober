import { createContext, useReducer, type ReactNode, useContext } from "react";
import { useRouter } from "next/router";
import { type AuthContextType, type User, type Action } from "./type";

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: User | null, action: Action): User | null => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, dispatch] = useReducer(authReducer, null);
  const router = useRouter();

  const login = async (user: User) => {
    dispatch({ type: "LOGIN", payload: user });
    await router.push("/rides/feed");
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    await router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthContextProvider");
  }
  return context;
}
