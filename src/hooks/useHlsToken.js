// hooks/useHlsToken.js
import { fetchHlsToken } from "../lib/fetchHlsToken";
import { useEffect, useState } from "react";

export function useHlsToken(isReady) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (!isReady) return;

    let interval;

    async function getToken() {
      const newToken = await fetchHlsToken();
      console.log(newToken, "new token");
      setToken(newToken);
    }

    getToken(); // Initial
    interval = setInterval(getToken, 90_000); // Refresh setiap 1.5 menit

    return () => clearInterval(interval);
  }, [isReady]); // tergantung dari isReady

  return token;
}
