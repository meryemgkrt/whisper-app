import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";
import { useApi } from "../lib/axios";

export const useUsers = () => {
    const { apiWithAuth } = useApi();

    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const { data } = await apiWithAuth<{ users: User[] }>({
                method: "GET",
                url: "/users"
            });
            console.log("👥 Users response:", JSON.stringify(data));
            return data.users ?? [];
        },
        staleTime: 0,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true
    });
};
