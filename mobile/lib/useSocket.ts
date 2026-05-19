import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { MessageSender, Message, Chat } from "../types";
import { QueryClient } from "@tanstack/react-query";
import * as Sentry from '@sentry/react-native';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") ?? "https://whisper-app-lhf2v.sevalla.app";

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>;
  unreadChats: Set<string>;
  currentChatId: string | null;
  queryClient: QueryClient | null;

  connect: (token: string, queryClient: QueryClient) => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string, currentUser: MessageSender) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
}

export const useSocket = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  typingUsers: new Map(),
  unreadChats: new Set(),
  currentChatId: null,
  queryClient: null,

  connect: (token: string, queryClient: QueryClient) => {
    const existingSocket = get().socket;
    if (existingSocket?.connected) return;
    if (existingSocket) existingSocket.disconnect();

    const socket = io(SOCKET_URL, { auth: { token } });

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
      Sentry.logger.info("Connected to socket server", { socketId: socket.id });
      set({ isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("⚠️ Disconnected from socket server");
      Sentry.logger.warn("Disconnected from socket server", { socketId: socket.id });
      set({ isConnected: false });
    });

    socket.on("online-users", ({ userIds }: { userIds: string[] }) => {
      console.log("🌐 Online users:", userIds);
      set({ onlineUsers: new Set(userIds) });
    });

    socket.on("user-online", ({ userId }: { userId: string }) => {
      console.log(`👤 User online: ${userId}`);
      set((state) => ({ onlineUsers: new Set([...state.onlineUsers, userId]) }));
    });

    socket.on("user-offline", ({ userId }: { userId: string }) => {
      set((state) => {
        const updated = new Set(state.onlineUsers);
        updated.delete(userId);
        console.log(`👤 User offline: ${userId}`);
        return { onlineUsers: updated };
      });
    });

    socket.on("socket-error", (error: { message: string }) => {
      console.log("❌ Socket error:", error.message);
      Sentry.logger.error("Socket error", { message: error.message });
    });

    socket.on("typing", ({ chatId, userId }: { chatId: string; userId: string }) => {
      set((state) => {
        const next = new Map(state.typingUsers);
        next.set(chatId, userId);
        return { typingUsers: next };
      });
    });

    socket.on("stop-typing", ({ chatId }: { chatId: string }) => {
      set((state) => {
        const next = new Map(state.typingUsers);
        next.delete(chatId);
        return { typingUsers: next };
      });
    });

    socket.on("new-message", (message: Message) => {
      const senderId = (message.sender as MessageSender)._id;
      const { currentChatId } = get();

      // ✅ { messages: Message[] } yapısına uygun
      queryClient.setQueryData<{ messages: Message[] }>(
        ["messages", message.chat],
        (old) => {
          if (!old) return { messages: [message] };
          const filtered = old.messages.filter((msg) => !msg._id.startsWith("temp-"));
          if (filtered.some((msg) => msg._id === message._id)) return { messages: filtered };
          return { messages: [...filtered, message] };
        }
      );

      queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
        return oldChats?.map((chat) => {
          if (chat._id !== message.chat) return chat;
          return {
            ...chat,
            lastMessage: {
              _id: message._id,
              text: message.text,
              sender: senderId,
              createdAt: message.createdAt,
            },
            lastMessageAt: message.createdAt,
          };
        });
      });

      if (currentChatId !== message.chat) {
        const chats = queryClient.getQueryData<Chat[]>(["chats"]);
        const chat = chats?.find((c) => c._id === message.chat);
        if (chat?.participant && senderId === chat.participant._id) {
          set((state) => ({
            unreadChats: new Set([...state.unreadChats, message.chat]),
          }));
        }
      }

      // typing göstergesini temizle
      set((state) => {
        const next = new Map(state.typingUsers);
        next.delete(message.chat);
        return { typingUsers: next };
      });
    });

    set({ socket, queryClient });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({
        socket: null,
        isConnected: false,
        onlineUsers: new Set(),
        typingUsers: new Map(),
        unreadChats: new Set(),
        currentChatId: null,
        queryClient: null,
      });
    }
  },

  joinChat: (chatId) => {
    const socket = get().socket;
    set((state) => {
      const unreadChats = new Set(state.unreadChats);
      unreadChats.delete(chatId);
      return { currentChatId: chatId, unreadChats };
    });
    if (socket?.connected) {
      socket.emit("join-chat", chatId);
    }
  },

  leaveChat: (chatId) => {
    const { socket } = get();
    set({ currentChatId: null });
    if (socket?.connected) {
      socket.emit("leave-chat", chatId);
    }
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      chat: chatId,
      sender: currentUser,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ✅ { messages: Message[] } yapısına uygun
    queryClient.setQueryData<{ messages: Message[] }>(
      ["messages", chatId],
      (old) => {
        const prev = old?.messages ?? [];
        return { messages: [...prev, optimisticMessage] };
      }
    );

    queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
      return oldChats?.map((chat) => {
        if (chat._id !== chatId) return chat;
        return {
          ...chat,
          lastMessage: {
            _id: optimisticMessage._id,
            text: optimisticMessage.text,
            sender: currentUser._id,
            createdAt: optimisticMessage.createdAt,
          },
          lastMessageAt: optimisticMessage.createdAt,
        };
      });
    });

    socket.emit("send-message", { chatId, text });

    Sentry.logger.info("Message sent", { chatId, messageLength: text.length });

    const errorHandler = (error: { message: string }) => {
      Sentry.logger.error("Failed to send message", { chatId, error: error.message });

      // ✅ { messages: Message[] } yapısına uygun
      queryClient.setQueryData<{ messages: Message[] }>(
        ["messages", chatId],
        (old) => {
          const prev = old?.messages ?? [];
          return { messages: prev.filter((msg) => msg._id !== tempId) };
        }
      );
    };

    socket.once("socket-error", errorHandler);
  },

  sendTyping: (chatId: string, isTyping: boolean) => {
    const { socket } = get();
    if (socket?.connected) {
      socket.emit(isTyping ? "typing" : "stop-typing", { chatId });
    }
  },
}));