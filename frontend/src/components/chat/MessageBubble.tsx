import { IMessage } from "../../types/message"; 
import { useAuth } from "../../context/AuthContext";
import Avatar from "../common/Avatar";

interface MessageBubbleProps {
  message: IMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { user } = useAuth();
    const isOwnMessage = message.senderId?._id === user?._id;
    
    return (
        <div className={`flex gap-3 mb-4 items-end ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            {!isOwnMessage && message.senderId && (
                <Avatar
                    src={message.senderId.avatarUrl}
                    name={message.senderId.username}
                    size="sm"
                    showOnline={true}
                    userId={message.senderId._id}
                />
            )}
            <div
                className={`px-4 py-3 rounded-2xl max-w-xs shadow-md ${
                    isOwnMessage
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-700 text-gray-100 rounded-bl-sm"
                }`}
            >
                {!isOwnMessage && message.senderId && (
                    <div className="text-xs font-semibold mb-1 opacity-80">
                        {message.senderId.username}
                    </div>
                )}
                {message.messageType === "text" && (
            <p>{message.content}</p>
        )}

        {message.messageType === "image" && message.mediaUrl && (
            <img src={message.mediaUrl} alt="Sent image" className="max-w-full h-auto rounded" />
        )}

        {message.messageType === "video" && message.mediaUrl && (
            <video controls className="max-w-full h-auto rounded">
                <source src={message.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        )}

        {message.messageType === "file" && message.mediaUrl && (
            <div className="flex items-center gap-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                    <a 
                        href={message.mediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`font-medium underline ${isOwnMessage ? 'text-white' : 'text-blue-400'}`}
                    >
                        {message.mediaUrl.split('/').pop()?.split('.').slice(0, -1).join('.') || 'File'}
                    </a>
                    <p className="text-xs opacity-75 mt-1">
                        {message.mediaUrl.endsWith('.pdf') ? 'PDF Document' : 'Document'}
                    </p>
                </div>
            </div>
        )}
            </div>
            {isOwnMessage && message.senderId && (
                <Avatar
                    src={message.senderId.avatarUrl}
                    name={message.senderId.username}
                    size="sm"
                    showOnline={true}
                    userId={message.senderId._id}
                />
            )}
        </div>
    );
}

export default MessageBubble;