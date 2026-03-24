import { useApi } from "../lib/axios";
import type { Chat } from "../types";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
    const api = useApi();

    return useQuery({
        queryKey: ["chats"],
        queryFn: async () => {
            const { data } = await api.get<Chat[]>("/chats");
            return data;
        }
    });
}