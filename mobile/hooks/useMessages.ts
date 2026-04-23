import { useEffect, useState, useCallback } from "react";
import { useApi } from "../lib/axios";
import { Message } from "../types";
import { useSocket } from "./useSocket";

export const useMessages = (chatId: string) => {
  const { apiWithAuth } = useApi();
  const socketRef = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiWithAuth<Message[]>({
          method: "GET",
          url: `/messages/chat/${chatId}`,
        });
        setMessages(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit("join-chat", chatId);

    const handleNewMessage = (message: Message) => {
      if (message.chat === chatId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === message._id);
          return exists ? prev : [...prev, message];
        });
      }
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.emit("leave-chat", chatId);
    };
  }, [chatId, socketRef.current]);

  const sendMessage = useCallback((text: string) => {
    const socket = socketRef.current;
    if (!socket || !text.trim()) return;
    socket.emit("send-message", { chatId, text: text.trim() });
  }, [chatId, socketRef.current]);

  return { messages, isLoading, error, sendMessage };
};