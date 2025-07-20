"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext({ socket: null, ready: false });

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // ✅ simpan ke state
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const newSocket = io("https://api.nimeninja.win/download", {
      transports: ["websocket"],
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(newSocket); // ✅ update state agar trigger re-render

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setReady(true);
    });

    newSocket.on("disconnect", () => {
      console.warn("⚠️ Socket disconnected");
      setReady(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, ready }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider

export const useSocket = () => useContext(SocketContext);
