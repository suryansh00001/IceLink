import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type SocketContextType = {
    socket: Socket | null;
    onlineUsers: Record<string, boolean>;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    onlineUsers: {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        if (!user) {
            setSocket(null);
            return;
        }

        const token = localStorage.getItem("token");

        const newSocket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
            auth: { token },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: maxReconnectAttempts
        });

        newSocket.on("connect", () => {
            console.log("✅ Socket connected");
            reconnectAttempts.current = 0;
            setSocket(newSocket);
        });

        newSocket.on("connect_error", (error) => {
            console.error("❌ Socket connection error:", error.message);
            reconnectAttempts.current++;
            
            if (reconnectAttempts.current >= maxReconnectAttempts) {
                console.error("Max reconnection attempts reached. Please refresh the page.");
            }
        });

        newSocket.on("reconnect", (attemptNumber) => {
            console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
        });

        newSocket.on("reconnect_failed", () => {
            console.error("❌ Socket reconnection failed. Please check your internet connection.");
        });

        newSocket.on("initialOnlineUsers", (userIds: string[]) => {
            const onlineUsersMap: Record<string, boolean> = {};
            userIds.forEach(id => {
                onlineUsersMap[id] = true;
            });
            setOnlineUsers(onlineUsersMap);
        });

        newSocket.on("onlineUsers", ({ userId, isOnline }) => {
            setOnlineUsers(prev => ({
                ...prev,
                [userId]: isOnline,
            }));
        });

        newSocket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
            setSocket(null);
            
            if (reason === "io server disconnect") {
                // Server disconnected, need to reconnect manually
                newSocket.connect();
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
