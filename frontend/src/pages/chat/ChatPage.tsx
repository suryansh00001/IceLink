import SideBar  from "../../components/layout/Sidebar";
import ChatList from "../../components/chat/ChatList";
import ChatRoom from "./ChatRoom";  
import {useChats} from "../../context/ChatContext";
import { useEffect } from "react";
import { getUserChats } from "../../api/chat.api";


const ChatPage = () => {
    const { setChats } = useChats();
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const chats = await getUserChats();
                setChats(chats);
            }
            catch (error) {
                console.error("Failed to fetch chats:", error);
            }
        };
        fetchChats();
    }, [setChats]);
    
    return (
        <div className="flex h-screen">
            <SideBar />
            <ChatList />
            <ChatRoom />
        </div>
    );
}

export default ChatPage;