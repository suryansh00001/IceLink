import { useEffect, useState } from "react";
import Avatar from "../../components/common/Avatar";
import Navbar from "../../components/layout/Navbar";
import Sidebar from "../../components/layout/Sidebar";

interface CallRecord {
    id: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    callType: "audio" | "video";
    direction: "incoming" | "outgoing" | "missed";
    timestamp: number;
    duration?: number;
}

const CallHistory = () => {
    const [callHistory, setCallHistory] = useState<CallRecord[]>([]);

    useEffect(() => {
        const loadCallHistory = () => {
            const stored = localStorage.getItem("callHistory");
            if (stored) {
                const history = JSON.parse(stored);
                setCallHistory(history.sort((a: CallRecord, b: CallRecord) => b.timestamp - a.timestamp));
            }
        };

        loadCallHistory();
        
        const interval = setInterval(loadCallHistory, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const getCallIcon = (callType: string, direction: string) => {
        const isMissed = direction === "missed";
        const isIncoming = direction === "incoming";
        
        if (callType === "video") {
            return (
                <div className={`p-3 rounded-full ${isMissed ? 'bg-red-100' : isIncoming ? 'bg-ice-100' : 'bg-green-100'}`}>
                    <svg className={`w-5 h-5 ${isMissed ? 'text-red-600' : isIncoming ? 'text-ice-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                    </svg>
                </div>
            );
        } else {
            return (
                <div className={`p-3 rounded-full ${isMissed ? 'bg-red-100' : isIncoming ? 'bg-ice-100' : 'bg-green-100'}`}>
                    <svg className={`w-5 h-5 ${isMissed ? 'text-red-600' : isIncoming ? 'text-ice-600' : 'text-green-600'} ${isIncoming ? 'transform rotate-135' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                </div>
            );
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return "Not answered";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const clearHistory = () => {
        if (window.confirm("Are you sure you want to clear all call history?")) {
            localStorage.removeItem("callHistory");
            setCallHistory([]);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col bg-gradient-to-br from-ice-50 to-white overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-ice-200 bg-gradient-to-r from-white to-ice-50/50 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-ice-700 to-ice-600 bg-clip-text text-transparent">Call History</h1>
                                <p className="text-ice-600 text-sm mt-1">{callHistory.length} total calls</p>
                            </div>
                            {callHistory.length > 0 && (
                                <button
                                    onClick={clearHistory}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Call List */}
                    <div className="flex-1 overflow-auto">
                        {callHistory.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-ice-400">
                                <svg className="w-24 h-24 mb-4 text-ice-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                                </svg>
                                <p className="text-xl font-medium">No call history</p>
                                <p className="text-sm mt-2">Your call history will appear here</p>
                            </div>
                        ) : (
                            <div className="p-4 space-y-2">
                                {callHistory.map((call) => (
                                    <div
                                        key={call.id}
                                        className="flex items-center gap-4 p-4 bg-white hover:bg-ice-50 rounded-xl border border-ice-100 transition-all duration-300 hover:shadow-md"
                                    >
                                        <Avatar
                                            src={call.avatarUrl}
                                            name={call.username}
                                            size="md"
                                        />
                                        
                                        {getCallIcon(call.callType, call.direction)}

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-ice-900 truncate">{call.username}</h3>
                                            <p className="text-sm text-ice-600">
                                                {call.direction === "incoming" && "Incoming"} 
                                                {call.direction === "outgoing" && "Outgoing"}
                                                {call.direction === "missed" && "Missed"}
                                                {" • "}
                                                {formatTimeAgo(call.timestamp)}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${call.duration ? 'text-ice-700' : 'text-red-600'}`}>
                                                {formatDuration(call.duration)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallHistory;
