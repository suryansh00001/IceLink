import { createContext, useContext , useState, Dispatch, SetStateAction, useEffect } from "react";
import { Ichat } from "../types/chat";
import { IMessage } from "../types/message";
import { useSocket } from "./SocketContext";

type chatContextType = {
    chats: Ichat[];
    setChats: Dispatch<SetStateAction<Ichat[]>>;
    selectedChat: Ichat | null;
    messages: IMessage[];
    selectChat: (chat: Ichat) => void;
    setMessages: Dispatch<SetStateAction<IMessage[]>>;
};

const ChatContext = createContext<chatContextType>({
    chats: [],
    setChats: () => {},
    selectedChat: null,  
    selectChat: () => {},
    messages: [],
    setMessages: () => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [chats, setChats] = useState<Ichat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Ichat | null>(null);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const { socket } = useSocket();
    
    const selectChat = (chat: Ichat) => {
        setSelectedChat(chat);
        setMessages([]);
    };

    useEffect(() => {
        if (!socket) return;

        const handleAvatarUpdate = ({ userId, avatarUrl }: { userId: string; avatarUrl: string }) => {
            setChats(prev => prev.map(chat => ({
                ...chat,
                participants: chat.participants.map(p => 
                    p._id === userId ? { ...p, avatarUrl } : p
                )
            })));

            setMessages(prev => prev.map(msg => 
                msg.senderId?._id === userId
                    ? { ...msg, senderId: { ...msg.senderId, avatarUrl } }
                    : msg
            ));

            if (selectedChat) {
                setSelectedChat(prev => prev ? ({
                    ...prev,
                    participants: prev.participants.map(p => 
                        p._id === userId ? { ...p, avatarUrl } : p
                    )
                }) : null);
            }
        };

        socket.on("userAvatarUpdated", handleAvatarUpdate);

        const handleMessageReceived = (message: IMessage) => {
            setChats(prev => prev.map(chat => 
                chat._id === message.chatId 
                    ? { ...chat, lastMessage: message }
                    : chat
            ).sort((a, b) => {
                const aTime = a.lastMessage?.createdAt || a.updatedAt;
                const bTime = b.lastMessage?.createdAt || b.updatedAt;
                return new Date(bTime).getTime() - new Date(aTime).getTime();
            }));
        };

        socket.on("message-received", handleMessageReceived);

        return () => {
            socket.off("userAvatarUpdated", handleAvatarUpdate);
            socket.off("message-received", handleMessageReceived);
        };
    }, [socket, selectedChat]);

    return (
        <ChatContext.Provider value={{ chats, setChats, selectChat, selectedChat, messages, setMessages }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChats = () => useContext(ChatContext);
