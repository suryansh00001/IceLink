import { useChats } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { IMessage } from "../../types/message";
import { getMessagesByChatId, sendMessage, uploadMedia } from "../../api/message.api";
import MessageBubble from "../../components/chat/MessageBubble";
import { useSocket } from "../../context/SocketContext";


export default function ChatRoom() {
    const { selectedChat, messages, setMessages } = useChats();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const { socket } = useSocket();

    useEffect(() => {
        if (socket && selectedChat) {
            socket.emit("joinChat", selectedChat._id);
        }
    }, [socket, selectedChat]);

    useEffect(() => {
        if (socket) {
            const handleMessageReceived = (message: IMessage) => {
                if (selectedChat && message.chatId === selectedChat._id) {
                    setMessages((prev: IMessage[]) => {
                        const exists = prev.some(m => m._id === message._id);
                        if (!exists) {
                            return [...prev, message];
                        }
                        return prev;
                    });
                }
            };

            socket.on("message-received", handleMessageReceived);
            
            return () => {
                socket.off("message-received", handleMessageReceived);
            }
        }
    }, [socket, selectedChat, setMessages]);

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

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !selectedChat || !user) return;

        try {
            const messageData = {
                chatId: selectedChat._id,
                content: newMessage,
                messageType: "text" as const
            };

            const savedMessage = await sendMessage(messageData as any);
            
            // Emit to socket for real-time delivery to others
            // Extract chatId string since backend response populates it as an object
            const messageForSocket = {
                ...savedMessage,
                chatId: typeof savedMessage.chatId === 'string' 
                    ? savedMessage.chatId 
                    : (savedMessage.chatId as any)?._id || selectedChat._id
            };
            socket?.emit("message-sent", messageForSocket);
            
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedChat || !user) return;

        try {
            const savedMessage = await uploadMedia(file, selectedChat._id);
            
            // Emit to socket for real-time delivery to others
            // Extract chatId string since backend response populates it as an object
            const messageForSocket = {
                ...savedMessage,
                chatId: typeof savedMessage.chatId === 'string' 
                    ? savedMessage.chatId 
                    : (savedMessage.chatId as any)?._id || selectedChat._id
            };
            socket?.emit("message-sent", messageForSocket);
            
            // Reset file input
            e.target.value = "";
        } catch (error) {
            console.error("Failed to send media:", error);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b border-gray-300 bg-white shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">
                    {selectedChat
                        ? selectedChat.isGroupChat
                            ? selectedChat.groupChatName
                            : selectedChat.participants[0]?.username
                        : "Select a chat"}
                </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
                {!selectedChat ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <p className="text-lg">Select a chat to start messaging</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble key={msg._id} message={msg} />
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-300 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-2xl hover:bg-gray-100 p-2 rounded-full transition duration-200"
                        title="Attach file"
                    >
                        📎
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={!selectedChat}
                        />
                    </label>
                    <input
                        type="text"
                        placeholder={selectedChat ? "Type a message..." : "Select a chat first"}
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                        disabled={!selectedChat}
                        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-primary disabled:bg-gray-100"
                    />
                    <button
                        type="submit"
                        disabled={!selectedChat || newMessage.trim() === ""}
                        className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
