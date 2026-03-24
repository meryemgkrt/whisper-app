import { useApi } from "../lib/axios"
import { User } from "../types"
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
    const api = useApi();

    return useMutation({
        mutationFn: async () => {
            const { data } = await api.post<{ user: User }>("/auth/callback");
            return data;
        }
    });
}

