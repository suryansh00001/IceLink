import { IMessage } from "../../types/message"; 
import { useAuth } from "../../context/AuthContext";

interface MessageBubbleProps {
  message: IMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const { user } = useAuth();
    const isOwnMessage = message.sender?._id === user?._id;
    return (
        <div
            className={`p-3 rounded-md max-w-xs ${
                isOwnMessage
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-gray-700 text-gray-100"
            }`}
        >
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
    );
}

export default MessageBubble;