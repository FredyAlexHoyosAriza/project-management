"use client";
import { useState, useEffect } from "react";

export function useAccessToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch("/api/auth/token");
        const data = await res.json();
        if (data.accessToken) {
          setToken(data.accessToken);
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    }
    fetchToken();
  }, []);
  return token;
}
