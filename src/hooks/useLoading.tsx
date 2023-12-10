import { useState } from "react";

export function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return { loading, startLoading, stopLoading };
}
