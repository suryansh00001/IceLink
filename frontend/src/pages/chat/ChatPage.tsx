import SideBar  from "../../components/layout/Sidebar";
import ChatList from "../../components/chat/ChatList";
import ChatRoom from "./ChatRoom";  
import Navbar from "../../components/layout/Navbar";
import IncomingCallModal from "../../components/call/IncomingCallModal";
import CallWindow from "../../components/call/CallWindow";
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
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <ChatList />
                <ChatRoom />
            </div>
            <IncomingCallModal />
            <CallWindow />
        </div>
    );
}

export default ChatPage;