import { useAuthCallback } from "../hooks/useAuth";
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/expo";
import * as Sentry from "@sentry/react-native";

const AuthSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { mutate: syncUser } = useAuthCallback();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (isSignedIn && user && !hasSynced.current) {
      hasSynced.current = true;

      syncUser(undefined, {
        onSuccess: (data) => {
          console.log("✅ User synced with backend:", data.user.name);
          Sentry.logger.info(`User synced with backend: ${data.user.name}`, {
            userId: user?.id,
            userName: data.user.name,
          });
        },
        onError: (error) => {
          console.log("❌ User sync failed for the user:", error);
          Sentry.logger.error("Failed to sync user with backend", {
            userId: user?.id,
            error: error instanceof Error ? error.message : String(error),
          });
        },
      });
    }

    if (!isSignedIn) {
      hasSynced.current = false;
    }
  }, [isSignedIn, user, syncUser]);

  return null;
};

export default AuthSync;