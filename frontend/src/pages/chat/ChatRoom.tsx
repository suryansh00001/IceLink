import { useChats } from "../../context/ChatContext";

export default function ChatRoom() {
  const { selectedChat } = useChats();

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
      <div className="flex-1 p-4 overflow-y-auto">
        {!selectedChat && (
          <p className="text-gray-400">No chat selected</p>
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
