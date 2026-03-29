import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useAuthSocial from "../../hooks/useSocialAuth";
import { AnimatedOrb } from "../../components/AnimatedOrb";
import { BlurView } from "expo-blur";
const { width, height } = Dimensions.get("window");
const AuthScreen = () => {
  const { handleSocialAuth, loadingStrategy } = useAuthSocial();
  const isLoading = loadingStrategy !== null;
  return (
    <View className="flex-1 bg-surface-dark">
      <View className="absolute inset-0 overflow-hidden">
        <LinearGradient
          colors={["#0d0d0f", "#1a1a2e", "#16213e", "#0d0d0f"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <AnimatedOrb
          colors={["#f4a261", "#e76f51"]}
          size={300}
          initialX={-80}
          initialY={height * 0.1}
          duration={4000}
        />
        <AnimatedOrb
          colors={["#f4a261", "#e76f51"]}
          size={250}
          initialX={width - 100}
          initialY={height * 0.3}
          duration={5000}
        />
        <AnimatedOrb
          colors={["#f4a261", "#e76f51"]}
          size={200}
          initialX={width * 0.3}
          initialY={height * 0.6}
          duration={3500}
        />
        <AnimatedOrb
          colors={["#f4a261", "#e76f51"]}
          size={180}
          initialX={-50}
          initialY={height * 0.75}
          duration={4500}
        />
        <BlurView
          intensity={60}
          tint="dark"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
      </View>
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
              ) : (
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
              )}
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
