import { useContext, useCallback } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "~/context/AuthContext";

interface UseAuthRedirectReturn {
  isLoggedIn: boolean;
  redirectTo: (path: string) => void;
}

const useAuthRedirect = (): UseAuthRedirectReturn => {
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  const redirectTo = useCallback(
    (path: string) => {
      if (router.pathname !== path) {
        void router.push(path);
      }
    },
    [router],
  );

  return { isLoggedIn, redirectTo };
};

export default useAuthRedirect;
