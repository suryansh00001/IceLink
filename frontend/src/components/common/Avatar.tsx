import { useSocket } from "../../context/SocketContext";

type AvatarProps = {
    src?: string;
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    showOnline?: boolean;
    userId?: string;
    className?: string;
};

const Avatar = ({ src, name, size = "md", showOnline = false, userId, className = "" }: AvatarProps) => {
    const { onlineUsers } = useSocket();
    const isOnline = userId ? onlineUsers[userId] : false;

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-xl",
    };

    const dotSizeClasses = {
        sm: "w-2 h-2",
        md: "w-2.5 h-2.5",
        lg: "w-3 h-3",
        xl: "w-4 h-4",
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`relative ${className}`}>
            <div
                className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold`}
            >
                {src ? (
                    <img src={src} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <span>{getInitials(name)}</span>
                )}
            </div>
            {showOnline && isOnline && (
                <div
                    className={`absolute bottom-0 right-0 ${dotSizeClasses[size]} bg-green-500 border-2 border-white rounded-full`}
                ></div>
            )}
        </div>
    );
};

export default Avatar;
