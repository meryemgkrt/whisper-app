import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUsers } from "../../hooks/useUsers";
import { useGetOrCreateChat } from "../../hooks/useChats";
import { User } from "../../types";
import UserItem from "../../components/UserItem";

const NewChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: allUsers = [], isLoading, error } = useUsers();
  const { mutate: getOrCreateChat, isPending: isCreatingChat } =
    useGetOrCreateChat();

  const users = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return allUsers;

    return allUsers.filter((u) => {
      return (
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
      );
    });
  }, [allUsers, searchQuery]);

  const handleUserSelect = (user: User) => {
    getOrCreateChat(user._id, {
      onSuccess: (chat) => {
        router.push({
          pathname: "/chat/[id]",
          params:{
            id: chat._id,
            participantId:chat.participant._id,
            name: chat.participant.name,
            avatar: chat.participant.avatar,
            
          }
        });
      },
      onError: (err: any) => {
        console.error("❌ Chat creation error:", err?.response?.data || err.message);
      },
    });
  };

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

          <View className="px-5 pt-3 pb-2 bg-surface">
            <View className="flex-row items-center bg-surface-card rounded-full px-3 py-1.5 gap-5 border border-surface-light">
              <Ionicons name="search" size={18} color="#6b6b70" />
              <TextInput
                placeholder="Search User"
                placeholderTextColor="#6b6b70"
                className="flex-1 text-foreground text-sm"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="flex-1 bg-surface">
            {isLoading || isCreatingChat ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#88f461" />
                <Text className="text-muted-foreground mt-2">
                  {isLoading ? "Loading users..." : "Creating chat..."}
                </Text>
              </View>
            ) : error ? (
              <View className="flex-1 items-center justify-center px-5">
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color="#ef4444"
                />
                <Text className="text-red-500 text-center mt-4 font-medium">
                  Error loading users
                </Text>
                <Text className="text-muted-foreground text-sm mt-1 text-center">
                  {(error as any)?.response?.data?.message ||
                    (error as Error)?.message ||
                    "Something went wrong"}
                </Text>
              </View>
            ) : users.length === 0 ? (
              <View className="flex-1 items-center justify-center px-5">
                <Ionicons name="person-outline" size={48} color="#6b6b70" />
                <Text className="text-muted-foreground text-center mt-4">
                  No users found
                </Text>
                <Text className="text-subtle-foreground text-sm mt-1">
                  Try adjusting your search or check back later.
                </Text>
              </View>
            ) : (
              <ScrollView
                className="flex-1 px-5 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {users.map((user) => (
                  <UserItem
                    key={user._id}
                    user={user}
                    onPress={() => handleUserSelect(user)}
                    isOnline={true}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewChatScreen;