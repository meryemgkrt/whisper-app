import { useAuth } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import api from "../lib/axios";
import { useEffect } from "react";
function useUserSync() {
  const { isSignedIn, getToken } = useAuth();

  const { mutate: syncUser, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const res = await api.post(
        "/auth/callback",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
  });

  useEffect(()=>{
    if(isSignedIn && !isPending && isSuccess){
      syncUser();
    }
  }, [isSignedIn, isPending, isSuccess]);

  return { isSynced: isSuccess, isSyncing: isPending, syncUser };
}

export default useUserSync;