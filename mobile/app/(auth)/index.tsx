import { View, Text, Dimensions, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import useAuthSocial from "../../hooks/useSocialAuth";
const { width, height } = Dimensions.get("window");
const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  const isLoading = loadingStrategy !== null;
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden"></View>
      <SafeAreaView className="flex-1">
        <View className="items-center pt-10">
          <View
            style={{
              shadowColor: "#C68642",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
            }}
          >
            <Image
              source={require("../../assets/images/logo.png")}
              style={{ width: 100, height: 100, marginVertical: -20 }}
              contentFit="contain"
            />
          </View>
          <Text
            className="text-4xl font-bold text-primary font-serif tracking-wider uppercase"
            style={{
              textShadowColor: "#C68642",
              textShadowOffset: { width: 0, height: 4 },
              textShadowRadius: 15,
            }}
          >
            Whisper
          </Text>
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <View
            style={{
              shadowColor: "#C68642",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 30,
              elevation: 10,
            }}
          >
            <Image
              source={require("../../assets/images/auth.png")}
              style={{ width: width - 48, height: height * 0.3 }}
              contentFit="contain"
            />
          </View>

          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center font-sans">
              Connect & Chat
            </Text>
            <Text className="text-3xl font-bold text-primary font-mono">
              Seamlessly
            </Text>
          </View>

          {/* Auth buttons will go here */}
          <View className="flex-row gap-4 pt-10">
            <Pressable
            
              
              className="flex-1 flex-row items-center justify-center gap-1 bg-white/95 py-4 rounded-2xl active:scale-[0.97]"
              disabled={isLoading}
              accessibilityLabel="Sign in with Google"
              accessibilityRole="button"
              onPress={() => !isLoading && handleSocialAuth("oauth_google")}

              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              {loadingStrategy == "oauth_google" ? (
                <ActivityIndicator size="small" color="#1a1a1a" />
              ):(
                <>
                 <Image
                source={require("../../assets/images/google.png")}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
              <Text className="text-gray-900 font-semibold text-sm">
                Google
              </Text>
                </>
              ) }
             
            </Pressable>

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              accessibilityLabel="Continue with Apple"
              onPress={() => !isLoading && handleSocialAuth("oauth_apple")}
              className="flex-1 flex-row items-center justify-center gap-1 bg-white/10 py-4 rounded-2xl active:scale-[0.97]"
              style={{
                shadowColor: "#C68642",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              {loadingStrategy == "oauth_apple" ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Ionicons name="logo-apple" size={20} color="#ffffff" />
                  <Text className="text-foreground font-semibold text-sm">
                    Apple
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default AuthScreen;
