import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@clerk/expo";

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL?.replace("/api", "") || "https://whisper-app-lhf2v.sevalla.app";

let socketInstance: Socket | null = null;

export const useSocket = () => {
  const { getToken } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      const token = await getToken();
      if (!token || !mounted) return;

      if (socketInstance?.connected) {
        socketRef.current = socketInstance;
        return;
      }

      const socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socket.on("connect", () => console.log("✅ Socket connected"));
      socket.on("disconnect", () => console.log("❌ Socket disconnected"));
      socket.on("connect_error", (err) => console.error("Socket error:", err.message));

      socketInstance = socket;
      socketRef.current = socket;
    };

    connect();

    return () => {
      mounted = false;
    };
  }, [getToken]);

  return socketRef;
};