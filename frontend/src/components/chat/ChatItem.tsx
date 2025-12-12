import { Ichat } from "../../types/chat";
import { useChats } from "../../context/ChatContext";

const ChatItem = ({ chat }: { chat: Ichat }) => {
  const { selectChat } = useChats();

  return (
    <div
      onClick={() => selectChat(chat)}
      className="p-4 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
    >
    {chat.isGroupChat ? "Group" : chat.participants.map(user => user.username).join(", ")}
    </div>
  );
};

export default ChatItem;
