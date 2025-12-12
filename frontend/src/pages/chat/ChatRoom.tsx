import { useChats } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { IMessage } from "../../types/message";
import { getMessagesByChatId, sendMessage, uploadMedia } from "../../api/message.api";
import MessageBubble from "../../components/chat/MessageBubble";
import { useSocket } from "../../context/SocketContext";
import GroupSettingsModal from "../../components/chat/GroupSettingsModal";
import Avatar from "../../components/common/Avatar";



export default function ChatRoom() {
    const { selectedChat, messages, setMessages } = useChats();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const { socket } = useSocket();
    const [istyping, setIsTyping] = useState(false);
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [showGroupSettings, setShowGroupSettings] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if(!socket || !selectedChat) {
            return;
        }

        if(!istyping) {
            setIsTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && istyping) {
                socket.emit("stopTyping", selectedChat._id);
                setIsTyping(false);
            }
        }, timerLength);
    }

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isOtherTyping]);

    useEffect(() => {
        if (!socket) return;

        const handleTyping = (data: { chatId: string; userId: string }) => {
            if (selectedChat && data.chatId === selectedChat._id && data.userId !== user?._id) {
                setIsOtherTyping(true);
                console.log(`User ${data.userId} is typing in chat ${data.chatId}`);
            }
        };
        const handleStopTyping = (data: { chatId: string; userId: string }) => {
            if (selectedChat && data.chatId === selectedChat._id && data.userId !== user?._id) {
                setIsOtherTyping(false);

                console.log(`User ${data.userId} stopped typing in chat ${data.chatId}`);
            }
        };

        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);
        return () => {
            socket.off("typing", handleTyping);
            socket.off("stopTyping", handleStopTyping);
        }
    }, [socket, selectedChat, user?._id]);

        



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
            <div className="p-4 border-b border-gray-300 bg-white shadow-sm flex justify-between items-center">
                {selectedChat && (
                    <div className="flex items-center gap-3">
                        {selectedChat.isGroupChat ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold text-lg">
                                👥
                            </div>
                        ) : (
                            <Avatar
                                src={selectedChat.participants.find(p => p._id !== user?._id)?.avatarUrl}
                                name={selectedChat.participants.find(p => p._id !== user?._id)?.username || "User"}
                                size="md"
                                showOnline={true}
                                userId={selectedChat.participants.find(p => p._id !== user?._id)?._id}
                            />
                        )}
                        <h2 className="text-xl font-semibold text-gray-800">
                            {selectedChat.isGroupChat
                                ? selectedChat.groupChatName
                                : selectedChat.participants.find(p => p._id !== user?._id)?.username || "User"}
                        </h2>
                    </div>
                )}
                {!selectedChat && (
                    <h2 className="text-xl font-semibold text-gray-800">Select a chat</h2>
                )}
                {selectedChat?.isGroupChat && (
                    <button
                        onClick={() => setShowGroupSettings(true)}
                        className="text-gray-600 hover:text-primary transition text-2xl"
                        title="Group Settings"
                    >
                        ⚙️
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-2">
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
                    <>
                        {messages.map((msg) => (
                            <MessageBubble key={msg._id} message={msg} />
                        ))}
                        <div ref={bottomRef} />
                    </>
                )}
                {isOtherTyping && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm ml-2">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                        <span>typing...</span>
                    </div>
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
                        onChange={(e) => { handleInputChange(e); }}
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

            {/* Group Settings Modal */}
            <GroupSettingsModal
                isOpen={showGroupSettings}
                onClose={() => setShowGroupSettings(false)}
                chat={selectedChat}
            />
        </div>
    );
}
