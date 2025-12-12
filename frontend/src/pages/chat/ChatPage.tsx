import SideBar  from "../../components/layout/Sidebar";
import ChatList from "../../components/chat/ChatList";
import ChatRoom from "./ChatRoom";  

const ChatPage = () => {
    return (
        <div className="flex h-screen">
            <SideBar />
            <ChatList />
            <ChatRoom />
        </div>
    );
}

export default ChatPage;