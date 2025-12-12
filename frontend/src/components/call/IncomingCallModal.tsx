import { useCall } from "../../context/CallContext";
import Avatar from "../common/Avatar";

const IncomingCallModal = () => {
    const { callState, callerInfo, answerCall, rejectCall, callType } = useCall();

    if (callState !== "receiving" || !callerInfo) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <Avatar
                        name={callerInfo.username}
                        size="xl"
                        showOnline={true}
                        userId={callerInfo.userId}
                        className="mx-auto mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {callerInfo.username}
                    </h2>
                    <p className="text-gray-600">
                        Incoming {callType} call...
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={rejectCall}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 transition-all"
                        title="Reject"
                    >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="2"/>
                        </svg>
                    </button>
                    <button
                        onClick={answerCall}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 transition-all"
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
