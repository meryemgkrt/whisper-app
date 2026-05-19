import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { useCurrentUser } from "../../hooks/useAuth";
import { useMessages } from "../../hooks/useMessages";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { useSocket } from "../../lib/useSocket";
import { Ionicons } from "@expo/vector-icons";
import EmptyUI from "../../components/EmptyUI";
import { MessageSender } from "../../types";
import MessageBubble from "../../components/MessageBubble";

type ChatParams = {
  id: string;
  participantId: string;
  name: string;
  avatar: string;
};

const ChatDetailScreen = () => {
  const {
    id: chatId,
    avatar,
    name,
    participantId,
  } = useLocalSearchParams<ChatParams>();
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: currentUser } = useCurrentUser();
  const { data, isLoading } = useMessages(chatId);
  const messages = data?.messages;

  const {
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    isConnected,
    onlineUsers,
    typingUsers,
  } = useSocket();

  const isOline = participantId ? onlineUsers.has(participantId) : false;
  const isTyping = typingUsers.get(chatId as string) === participantId;

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chatId) joinChat(chatId as string);
    return () => leaveChat(chatId as string);
  }, [chatId]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleTyping = useCallback(
    (text: string) => {
      setMessageText(text);

      if (!isConnected || !chatId) return;

      if (text.length > 0) {
        sendTyping(chatId as string, true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          sendTyping(chatId as string, false);
        }, 2000);
      } else {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        sendTyping(chatId as string, false);
      }
    },
    [chatId, isConnected, sendTyping],
  );

  const handleSend = () => {
    if (!messageText.trim() || !chatId || !currentUser) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping(chatId as string, false);

    setIsSending(true);
    sendMessage(chatId as string, messageText.trim(), {
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      avatar: currentUser.avatar,
    });
    setMessageText("");
    setIsSending(false);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-surface border-b border-surface-light">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            android_ripple={{ color: "#f4a26133", radius: 18 }}
            className="w-8 h-8 items-center justify-center"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            {({ pressed }) => (
              <Ionicons
                name="arrow-back"
                size={22}
                color={pressed ? "#e76f51" : "#f4a261"}
              />
            )}
          </Pressable>

          {avatar && (
            <View className="relative">
              <Image
                source={avatar}
                style={{ width: 40, height: 40, borderRadius: 999 }}
              />
              {isOline && (
                <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
              )}
            </View>
          )}

          <View>
            <Text
              className="text-foreground font-semibold text-base"
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              className={`text-xs ${isOline ? "text-green-500" : "text-muted-foreground"}`}
            >
              {isTyping ? "Typing..." : isOline ? "Online" : "Offline"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1">
          <Pressable
            android_ripple={{ color: "#f4a26133", radius: 18 }}
            className="w-9 h-9 rounded-full bg-surface-card items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              backgroundColor: pressed ? "#f4a26122" : undefined,
            })}
          >
            {({ pressed }) => (
              <Ionicons
                name="call-outline"
                size={18}
                color={pressed ? "#e76f51" : "#f4a261"}
              />
            )}
          </Pressable>

          <Pressable
            android_ripple={{ color: "#f4a26133", radius: 18 }}
            className="w-9 h-9 rounded-full bg-surface-card items-center justify-center"
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              backgroundColor: pressed ? "#f4a26122" : undefined,
            })}
          >
            {({ pressed }) => (
              <Ionicons
                name="videocam-outline"
                size={18}
                color={pressed ? "#e76f51" : "#f4a261"}
              />
            )}
          </Pressable>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View className="flex-1 bg-surface">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#f4a261" />
            </View>
          ) : !messages || messages.length === 0 ? (
            <EmptyUI
              title="No messages yet"
              subtitle="Start the conversation by sending a message."
              iconName="chatbubbles-outline"
              iconSize={64}
              iconColor="#f4a261"
            />
          ) : (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                gap: 8,
              }}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: false })
              }
            >
              {messages?.map((message) => {
                const sender = message.sender as MessageSender;
                const senderId = sender._id;
                // ✅ currentUser direkt User tipi döndürüyor
                const isFromMe = currentUser
                  ? senderId === currentUser._id
                  : false;
                return (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isFromMe={isFromMe}
                  />
                );
              })}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Input */}
      <View className="px-3 pb-3 pt-2 bg-surface border-t border-surface-light">
        <View className="flex-row items-end bg-surface-card rounded-3xl px-4 py-2 gap-3">
          <Pressable className="w-9 h-9 items-center justify-center mb-0.5">
            <Ionicons name="add" size={22} color="#f4a261" />
          </Pressable>

          <TextInput
            placeholder="Type a message..."
            className="flex-1 text-foreground text-sm py-2 max-h-28"
            placeholderTextColor="#f4a261aa"
            multiline
            value={messageText}
            onChangeText={handleTyping}
            onSubmitEditing={handleSend}
            editable={!isSending}
          />

          <Pressable
            onPress={handleSend}
            disabled={isSending}
            className="w-9 h-9 rounded-full bg-orange-400 items-center justify-center mb-0.5"
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;