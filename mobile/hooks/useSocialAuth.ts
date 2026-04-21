import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";
import * as AuthSession from "expo-auth-session";
import { useAuthCallback } from "./useAuth";

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const { mutateAsync: syncUser } = useAuthCallback();

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_apple"
  ) => {
    if (loadingStrategy) return;

    setLoadingStrategy(strategy);

    try {
      const redirectUrl = AuthSession.makeRedirectUri();
      console.log("🔗 Redirect URI:", redirectUrl);

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });

        console.log("🚀 Syncing user with backend...");
        const result = await syncUser();
        console.log("✅ User synced with backend:", result?.user?.name);
      } else {
        const provider = strategy === "oauth_google" ? "Google" : "Apple";

        Alert.alert(
          "Sign-in incomplete",
          `${provider} sign-in did not complete. Please try again.`
        );
      }
    } catch (error: any) {
      console.log("💥 Error code:", error?.code);
      console.log("💥 Error message:", error?.message);
      console.log("💥 Full error:", JSON.stringify(error, null, 2));

      const provider = strategy === "oauth_google" ? "Google" : "Apple";

      Alert.alert(
        "Authentication Failed",
        `Failed to sign in with ${provider}. Please try again.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => handleSocialAuth(strategy),
          },
        ]
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { handleSocialAuth, loadingStrategy };
}

export default useSocialAuth;