import { useEffect, useRef } from "react";
import { useCall } from "../../context/CallContext";

const CallWindow = () => {
    const { 
        callState, 
        localStream, 
        remoteStream, 
        isAudioEnabled, 
        isVideoEnabled,
        callType,
        endCall,
        toggleAudio,
        toggleVideo
    } = useCall();

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, callState]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream, callState]);

    useEffect(() => {
        if (callType === "audio") {
            if (localAudioRef.current && localStream) {
                localAudioRef.current.srcObject = localStream;
            }
            if (remoteAudioRef.current && remoteStream) {
                remoteAudioRef.current.srcObject = remoteStream;
            }
        }
    }, [localStream, remoteStream, callType, callState]);

    if (callState !== "calling" && callState !== "active") return null;

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            <div className="flex-1 relative">
                {callType === "video" && (
                    <>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white shadow-lg"
                        />
                    </>
                )}

                {callType === "audio" && (
                    <>
                        <audio ref={remoteAudioRef} autoPlay />
                        <audio ref={localAudioRef} autoPlay muted />
                        <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto">
                                🎙️
                            </div>
                            <p className="text-white text-xl">
                                {callState === "calling" ? "Calling..." : "In call"}
                            </p>
                        </div>
                        </div>
                    </>
                )}

                {callState === "calling" && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-white text-xl">
                        Calling...
                    </div>
                )}
            </div>

            <div className="bg-gray-800 p-6 flex justify-center gap-4">
                {callType === "video" && (
                    <button
                        onClick={toggleVideo}
                        className={`rounded-full p-4 transition-all ${
                            isVideoEnabled 
                                ? "bg-gray-700 hover:bg-gray-600" 
                                : "bg-red-500 hover:bg-red-600"
                        }`}
                        title={isVideoEnabled ? "Turn off video" : "Turn on video"}
                    >
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            {isVideoEnabled ? (
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            ) : (
                                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                            )}
                        </svg>
                    </button>
                )}

                <button
                    onClick={toggleAudio}
                    className={`rounded-full p-4 transition-all ${
                        isAudioEnabled 
                            ? "bg-gray-700 hover:bg-gray-600" 
                            : "bg-red-500 hover:bg-red-600"
                    }`}
                    title={isAudioEnabled ? "Mute" : "Unmute"}
                >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        {isAudioEnabled ? (
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        )}
                    </svg>
                </button>

                <button
                    onClick={endCall}
                    className="bg-red-500 hover:bg-red-600 rounded-full p-4 transition-all"
                    title="End call"
                >
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="2"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CallWindow;
