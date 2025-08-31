import { useQuery } from "@tanstack/react-query";
import { addressSearchApi } from "../api";
import { useState, useCallback } from "react";
import { clearTimeout, setTimeout } from "timers";

export const useAddressSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const { data: addresses = [], isLoading, error } = useQuery({
    queryKey: ["addressSearch", debouncedQuery],
    queryFn: () => addressSearchApi.searchAddresses(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const search = useCallback((query: string) => {
    setSearchQuery(query);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    setDebounceTimer(timer);
  }, [debounceTimer]);

  const clear = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
  }, [debounceTimer]);

  return {
    searchQuery,
    search,
    clear,
    addresses,
    isLoading,
    error,
  };
};
