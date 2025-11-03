import { useState, useEffect, useCallback } from "react";
import type { ChristmasMarket } from "../types/marker";

export const useChristmasMarkets = () => {
  const [markets, setMarkets] = useState<ChristmasMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL =
        import.meta.env.VITE_API_URL ||
        "https://sandra-s-market-prod-backend.onrender.com";

      const response = await fetch(`${API_BASE_URL}/api/markets`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch markets: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setMarkets(data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Failed to fetch markets:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  return {
    markets,
    loading,
    error,
    refetch: fetchMarkets,
  };
};
