import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useChats } from "../../hooks/useChats";
import ChatItem from "../../components/ChatItem";
import { Ionicons } from "@expo/vector-icons";
import EmptyUI from "../../components/EmptyUI";
import { Chat } from "../../types";

export default function ChatsTab() {
  const router = useRouter();
  const { data: chats, isLoading, error, refetch } = useChats();

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#f4a261" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-red-400 text-xl font-medium">
          Failed to load chats. Please try again later.
        </Text>
        <Pressable onPress={()=>refetch} className="flex-row items-center mt-4 px-3 py-2 rounded-md bg-primary ">
          <Text className=" text-l font-medium mt-2 text-foreground">
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

 const handleChatsPress = (chat: Chat) => {
  router.push({
    pathname: "/chat/[id]",
    params: {
      id: chat._id,
      participantId: chat.participant._id,
      name: chat.participant.name,
      avatar: chat.participant.avatar,
    },
  });
};
  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatsPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
        }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <EmptyUI
            title="No chats available"
            subtitle="Submit a conversation."
              iconName="chatbubbles-outline"
              iconColor="#6B6B70"
              iconSize={64}
              buttonLabel="Start a chat"
              onPressButton={()=>console.log("pressed")}
          />
        }
      />
    </View>
  );
}

function Header() {
  return (
    <View className="px-5 pt-4 pb-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-3xl font-bold text-foreground tracking-tight">
            Chats
          </Text>
        </View>
        <Pressable className="size-11 bg-primary rounded-full items-center justify-center active:opacity-70">
          <Ionicons name="create-outline" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
