"use client";
import { useState, useEffect } from "react";

export function useAccessToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // if (token !== null) return;
    async function fetchToken() {
      try {
        const res = await fetch("/api/auth/token");
        if (!res.ok) {
          console.error("Error fetching access token:", res.status);
          return;
        }
        const data = await res.json();
        // console.log('Response fetch data /api/auth/token', data);
        if (data.accessToken) {
          setToken(data.accessToken);
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    }
    fetchToken();
  }, []);
  // console.log('Token',token);
  return token;
}
