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
            <a href={message.mediaUrl} download className="text-blue-400 underline">
                Download File
            </a>
        )}

        </div>
    );
}

export default MessageBubble;