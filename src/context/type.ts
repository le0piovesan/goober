import { type Dispatch } from "react";

type User = {
  id: number;
  name: string;
  type: string;
  image: string;
  email: string;
  isLoggedIn: boolean;
};

type Action = { type: "LOGIN"; payload: User } | { type: "LOGOUT" };

type AuthContextType = {
  user: User | null;
  dispatch: Dispatch<Action>;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

export type { User, Action, AuthContextType };
