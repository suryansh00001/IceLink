import { useChats } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useCall } from "../../context/CallContext";
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
    const { initiateCall } = useCall();
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
        <div className="flex-1 flex flex-col bg-gradient-to-br from-ice-50 to-white">
            {/* Header */}
            <div className="p-4 border-b border-ice-200 bg-gradient-to-r from-white to-ice-50/50 shadow-md flex justify-between items-center backdrop-blur-sm">
                {selectedChat && (
                    <div className="flex items-center gap-3">
                        {selectedChat.isGroupChat ? (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ice-400 to-ice-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
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
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-ice-700 to-ice-600 bg-clip-text text-transparent">Select a chat</h2>
                )}
                <div className="flex items-center gap-2">
                    {selectedChat && !selectedChat.isGroupChat && (
                        <>
                            <button
                                onClick={() => {
                                    const otherUser = selectedChat.participants.find(p => p._id !== user?._id);
                                    if (otherUser) {
                                        initiateCall(otherUser._id, otherUser.username, "audio");
                                    }
                                }}
                                className="bg-ice-500 hover:bg-ice-600 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
                                title="Audio Call"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                            </button>
                            <button
                                onClick={() => {
                                    const otherUser = selectedChat.participants.find(p => p._id !== user?._id);
                                    if (otherUser) {
                                        initiateCall(otherUser._id, otherUser.username, "video");
                                    }
                                }}
                                className="bg-ice-600 hover:bg-ice-700 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110"
                                title="Video Call"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                                </svg>
                            </button>
                        </>
                    )}
                    {selectedChat?.isGroupChat && (
                        <button
                            onClick={() => setShowGroupSettings(true)}
                            className="bg-ice-500 hover:bg-ice-600 text-white p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                            title="Group Settings"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                            </svg>
                        </button>
                    )}
                </div>
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
            <div className="p-4 border-t border-ice-200 bg-gradient-to-r from-white to-ice-50/30">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer hover:bg-ice-100 p-2 rounded-lg transition-all duration-300 text-ice-600 hover:text-ice-700"
                        title="Attach file"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                        </svg>
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
                        className="flex-1 px-5 py-3 rounded-full ice-input disabled:bg-ice-50"
                    />
                    <button
                        type="submit"
                        disabled={!selectedChat || newMessage.trim() === ""}
                        className="ice-button px-6 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
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
