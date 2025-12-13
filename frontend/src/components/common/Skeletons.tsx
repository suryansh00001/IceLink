export const ChatSkeleton = () => {
    return (
        <div className="animate-pulse flex gap-3 p-4 border-b border-ice-700/30">
            <div className="w-12 h-12 bg-ice-700/50 rounded-full"></div>
            <div className="flex-1">
                <div className="h-4 bg-ice-700/50 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-ice-700/50 rounded w-2/3"></div>
            </div>
        </div>
    );
};

export const MessageSkeleton = () => {
    return (
        <div className="animate-pulse flex gap-3 mb-4">
            <div className="w-8 h-8 bg-ice-700/50 rounded-full"></div>
            <div className="flex-1">
                <div className="h-3 bg-ice-700/50 rounded w-1/4 mb-2"></div>
                <div className="h-16 bg-ice-700/50 rounded-lg w-3/4"></div>
            </div>
        </div>
    );
};

export const ProfileSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6 p-6">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-ice-700/50 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-6 bg-ice-700/50 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-ice-700/50 rounded w-1/2"></div>
                </div>
            </div>
            <div className="space-y-4">
                <div className="h-12 bg-ice-700/50 rounded"></div>
                <div className="h-12 bg-ice-700/50 rounded"></div>
                <div className="h-12 bg-ice-700/50 rounded"></div>
            </div>
        </div>
    );
};

export const CallHistorySkeleton = () => {
    return (
        <div className="animate-pulse space-y-4 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-ice-800/30 rounded-lg">
                    <div className="w-12 h-12 bg-ice-700/50 rounded-full"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-ice-700/50 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-ice-700/50 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 w-8 bg-ice-700/50 rounded-full"></div>
                </div>
            ))}
        </div>
    );
};

export const SettingsSkeleton = () => {
    return (
        <div className="animate-pulse space-y-6 p-6">
            <div className="h-8 bg-ice-700/50 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <div className="h-4 bg-ice-700/50 rounded w-1/6 mb-2"></div>
                        <div className="h-12 bg-ice-700/50 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};
