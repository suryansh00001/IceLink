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

  return (
    <div
      onClick={() => selectChat(chat)}
      className="p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
    >
      {chat.isGroupChat ? (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
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
        <div className="font-medium text-gray-900 truncate">{displayName}</div>
        {chat.isGroupChat && (
          <div className="text-xs text-gray-500">
            {chat.participants.length} members
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatItem;
