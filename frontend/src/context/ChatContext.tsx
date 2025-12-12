import { createContext, useContext , useState } from "react";
import { Ichat } from "../types/chat";
import { IMessage } from "../types/message";

type chatContextType = {
    chats: Ichat[];
    setChats: (chats: Ichat[]) => void;
    selectedChat: Ichat | null;
    messages: IMessage[];
    selectChat: (chat: Ichat) => void;
    setMessages: (messages: IMessage[]) => void;
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
    const selectChat = (chat: Ichat) => {
        setSelectedChat(chat);
        setMessages([]);
    };
    return (
        <ChatContext.Provider value={{ chats, setChats, selectChat, selectedChat, messages, setMessages }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChats = () => useContext(ChatContext);
