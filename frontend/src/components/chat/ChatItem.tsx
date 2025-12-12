import { Ichat } from "../../types/chat";
import { useChats } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";

const ChatItem = ({ chat }: { chat: Ichat }) => {
  const { selectChat } = useChats();
  const { user } = useAuth();

  // For 1-on-1 chats, get the other participant
  const otherUser = chat.isGroupChat 
    ? null 
    : chat.participants.find(p => p._id !== user?._id);

  const displayName = chat.isGroupChat 
    ? chat.groupChatName || "Group Chat"
    : otherUser?.username || "Unknown";

  const avatarSrc = chat.isGroupChat 
    ? undefined 
    : otherUser?.avatarUrl;

  const getLastMessagePreview = () => {
    if (!chat.lastMessage) return "No messages yet";

    const { messageType, content, mediaUrl, sender } = chat.lastMessage;
    const senderName = chat.isGroupChat && sender 
      ? `${sender.username}: ` 
      : "";

    switch (messageType) {
      case "text":
        return `${senderName}${content}`;
      case "image":
        return `${senderName}📷 Image`;
      case "video":
        return `${senderName}🎥 Video`;
      case "file":
        return `${senderName}📎 File`;
      default:
        return `${senderName}Message`;
    }
  };

  return (
    <div
      onClick={() => selectChat(chat)}
      className="p-3 border-b border-ice-100 hover:bg-gradient-to-r hover:from-ice-50 hover:to-ice-100/50 cursor-pointer flex items-center gap-3 transition-all duration-300 hover:shadow-md hover:border-ice-200"
    >
      {chat.isGroupChat ? (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center text-white font-semibold shadow-md">
          👥
        </div>
      ) : (
        <Avatar 
          src={avatarSrc}
          name={displayName}
          size="md"
          showOnline={true}
          userId={otherUser?._id}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-ice-900 truncate">{displayName}</div>
        <div className="text-sm text-ice-600 truncate">
          {getLastMessagePreview()}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
