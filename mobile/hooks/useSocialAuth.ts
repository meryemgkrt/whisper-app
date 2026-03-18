import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

function useAuthSocial() {
    const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
    const { startSSOFlow } = useSSO();

    const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
        setLoadingStrategy(strategy);

        try {
            const { createdSessionId, setActive } = await startSSOFlow({ strategy });
            if (createdSessionId && setActive) {
                await setActive({ session: createdSessionId });

            }

        } catch (error) {
            console.log("💥 Error in social auth:", error);
            const provider = strategy === "oauth_google" ? "Google" : "Apple";
            Alert.alert(
                "Authentication Failed",
                `Failed to sign in with ${provider}. Please try again.`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
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

export default useAuthSocial;