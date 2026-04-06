import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUsers } from "../../hooks/useUsers";

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {data:allUsers, isLoading} = useUsers();
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-surface rounded-t-3xl h-[95%] overflow-hidden">
        
          <View className="px-5 pt-3 pb-3 bg-surface border-b border-surface-light flex-row items-center gap-3">
            <Pressable
              className="w-9 h-9 rounded-full bg-surface-card items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={26} color="#f4a261" />
            </Pressable>
            <View className="flex-1">
              <Text className="text-foreground text-xl">New Chat</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">
                Start a new conversation
              </Text>
            </View>
          </View>
          {/* SCREEN CONTENT */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewChatScreen;
