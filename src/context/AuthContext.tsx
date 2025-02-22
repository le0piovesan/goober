import {
  createContext,
  useReducer,
  useEffect,
  type ReactNode,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { type AuthContextType, type User, type Action } from "./type";
import { useLoading } from "~/hooks/useLoading";

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: User | null, action: Action): User | null => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    case "LOGOUT":
      localStorage.removeItem("user");
      return null;
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, dispatch] = useReducer(authReducer, null);
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    startLoading();
    const user = localStorage.getItem("user");
    if (user) {
      dispatch({ type: "LOGIN", payload: JSON.parse(user) as User });
    }
    stopLoading();
  }, []);

  const login = async (user: User) => {
    dispatch({ type: "LOGIN", payload: user });
    if (user.type === "Driver" && user.profileCompleted === false) {
      await router.replace("/users/drivers/onboarding");
      return;
    }
    await router.replace("/rides/feed");
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    await router.replace("/");
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
