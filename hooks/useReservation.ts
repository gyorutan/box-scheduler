import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export const useReservation = () => {
  const { data, isLoading, error, mutate } = useSWR(
    "/api/reservations",
    fetcher
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};
