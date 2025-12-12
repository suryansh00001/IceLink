import { useChats } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { IMessage } from "../../types/message";
import { getMessagesByChatId } from "../../api/message.api";
import MessageBubble from "../../components/chat/MessageBubble";

export default function ChatRoom() {
 const { selectedChat, messages, setMessages } = useChats();
 const { user } = useAuth();
    useEffect(() => {
        const fetchMessages = async () => {
            if (selectedChat) {
                try {
                    const fetchedMessages: IMessage[] = await getMessagesByChatId(selectedChat._id);
                    setMessages(fetchedMessages);
                }
                catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            }
        };
        fetchMessages();
    }, [selectedChat, setMessages]);

  return (
    
    <div className="flex-1 flex flex-col bg-gray-800">

      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">
          {selectedChat
            ? selectedChat.isGroupChat
              ? selectedChat.groupChatName
              : selectedChat.participants[0]?.username
            : "Select a chat"}
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-3 rounded-md max-w-xs ${
                msg.sender?._id === user?._id
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
                <MessageBubble message={msg} />
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-700">
        <input
          disabled={!selectedChat}
          placeholder={
            selectedChat ? "Type a message..." : "Select a chat first"
          }
          className="w-full p-3 bg-gray-700 rounded"
        />
      </div>

    </div>
  );
}
