import { useCall } from "../../context/CallContext";
import Avatar from "../common/Avatar";

const IncomingCallModal = () => {
    const { callState, callerInfo, answerCall, rejectCall, callType } = useCall();

    if (callState !== "receiving" || !callerInfo) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-ice-950/90 to-ice-900/95 backdrop-blur-md flex items-center justify-center z-50">
            <div className="ice-card p-10 max-w-md w-full text-center animate-pulse-slow">
                <div className="mb-8">
                    <Avatar
                        name={callerInfo.username}
                        size="xl"
                        showOnline={true}
                        userId={callerInfo.userId}
                        className="mx-auto mb-6 ring-4 ring-ice-300 shadow-2xl"
                    />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-ice-700 to-ice-600 bg-clip-text text-transparent mb-3">
                        {callerInfo.username}
                    </h2>
                    <p className="text-ice-600 text-lg flex items-center justify-center gap-2">
                        {callType === "video" ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                            </svg>
                        )}
                        Incoming {callType} call...
                    </p>
                </div>

                <div className="flex gap-6 justify-center">
                    <button
                        onClick={rejectCall}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-5 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
                        title="Reject"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="2"/>
                        </svg>
                    </button>
                    <button
                        onClick={answerCall}
                        className="bg-gradient-to-r from-ice-500 to-ice-600 hover:from-ice-600 hover:to-ice-700 text-white rounded-full p-5 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
                        title="Answer"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
