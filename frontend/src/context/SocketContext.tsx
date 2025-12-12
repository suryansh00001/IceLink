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

    useEffect(() => {
        if (!user) {
            setSocket(null);
            return;
        }

        const token = localStorage.getItem("token");

        const newSocket = io("http://localhost:5000", {
            auth: { token }
        });

        newSocket.on("connect", () => {
            setSocket(newSocket);
        });

        newSocket.on("connect_error", (error) => {
            console.error("Socket connection error:", error.message);
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

        newSocket.on("disconnect", () => {
            setSocket(null);
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
