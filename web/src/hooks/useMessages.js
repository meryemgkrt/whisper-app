import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import api from "../lib/axios";

export function useMessages(chatId) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["messages", chatId],
    enabled: !!chatId,
    queryFn: async () => {
      const token = await getToken();

      const res = await api.get(`/messages/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
  });
}