import { createContext, useContext , useState, Dispatch, SetStateAction } from "react";
import { Ichat } from "../types/chat";
import { IMessage } from "../types/message";

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
