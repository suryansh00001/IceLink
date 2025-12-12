import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import { createPeerConnection, getMediaStream, stopMediaStream } from "../utils/webrtc";

type CallState = "idle" | "calling" | "receiving" | "active" | "ended";

type CallContextType = {
    callState: CallState;
    localStream: MediaStream | null;
    remoteStream: MediaStream | null;
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    callType: "audio" | "video";
    callerInfo: { userId: string; username: string } | null;
    initiateCall: (userId: string, username: string, type: "audio" | "video") => Promise<void>;
    answerCall: () => Promise<void>;
    rejectCall: () => void;
    endCall: () => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
};

const CallContext = createContext<CallContextType>({
    callState: "idle",
    localStream: null,
    remoteStream: null,
    isAudioEnabled: true,
    isVideoEnabled: true,
    callType: "video",
    callerInfo: null,
    initiateCall: async () => {},
    answerCall: async () => {},
    rejectCall: () => {},
    endCall: () => {},
    toggleAudio: () => {},
    toggleVideo: () => {},
});

export const CallProvider = ({ children }: { children: React.ReactNode }) => {
    const { socket } = useSocket();
    const { user } = useAuth();
    const [callState, setCallState] = useState<CallState>("idle");
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [callType, setCallType] = useState<"audio" | "video">("video");
    const [callerInfo, setCallerInfo] = useState<{ userId: string; username: string } | null>(null);
    
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const otherUserIdRef = useRef<string | null>(null);

    const initiateCall = async (userId: string, username: string, type: "audio" | "video") => {
        try {
            setCallType(type);
            setCallState("calling");
            otherUserIdRef.current = userId;

            const stream = await getMediaStream(true, type === "video");
            setLocalStream(stream);

            const peerConnection = createPeerConnection();
            peerConnectionRef.current = peerConnection;

            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream);
            });

            peerConnection.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit("iceCandidate", {
                        to: userId,
                        candidate: event.candidate
                    });
                }
            };

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            socket?.emit("callUser", {
                to: userId,
                signalData: offer,
                from: user?._id,
                name: user?.username,
                callType: type
            });
        } catch (error) {
            console.error("Error initiating call:", error);
            setCallState("idle");
        }
    };

    const answerCall = async () => {
        try {
            if (!callerInfo || !peerConnectionRef.current) return;

            const stream = await getMediaStream(true, callType === "video");
            setLocalStream(stream);

            stream.getTracks().forEach(track => {
                peerConnectionRef.current!.addTrack(track, stream);
            });

            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socket?.emit("answerCall", {
                to: callerInfo.userId,
                signalData: answer
            });

            setCallState("active");
        } catch (error) {
            console.error("Error answering call:", error);
            endCall();
        }
    };

    const rejectCall = () => {
        if (callerInfo && socket) {
            socket.emit("rejectCall", { to: callerInfo.userId });
        }
        setCallerInfo(null);
        setCallState("idle");
    };

    const endCall = () => {
        if (otherUserIdRef.current && socket) {
            socket.emit("endCall", { to: otherUserIdRef.current });
        }

        stopMediaStream(localStream);
        stopMediaStream(remoteStream);

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setLocalStream(null);
        setRemoteStream(null);
        setCallState("idle");
        setCallerInfo(null);
        otherUserIdRef.current = null;
    };

    const toggleAudio = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioEnabled(audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    useEffect(() => {
        if (!socket) return;

        socket.on("callUser", async ({ signal, from, name, callType: incomingCallType }) => {
            setCallerInfo({ userId: from, username: name });
            setCallType(incomingCallType || "video");
            setCallState("receiving");
            otherUserIdRef.current = from;

            const peerConnection = createPeerConnection();
            peerConnectionRef.current = peerConnection;
            
            peerConnection.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            peerConnection.onicecandidate = (event) => {
                if (event.candidate && socket) {
                    socket.emit("iceCandidate", {
                        to: from,
                        candidate: event.candidate
                    });
                }
            };
            
            await peerConnection.setRemoteDescription(new RTCSessionDescription(signal));
        });

        socket.on("callAccepted", async (signal) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
                setCallState("active");
            }
        });

        socket.on("iceCandidate", async (candidate) => {
            if (peerConnectionRef.current) {
                try {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                    console.error("Error adding ICE candidate:", error);
                }
            }
        });

        socket.on("callRejected", () => {
            alert("Call was rejected");
            endCall();
        });

        socket.on("callEnded", () => {
            endCall();
        });

        socket.on("callCanceled", () => {
            setCallerInfo(null);
            setCallState("idle");
        });

        return () => {
            socket.off("callUser");
            socket.off("callAccepted");
            socket.off("iceCandidate");
            socket.off("callRejected");
            socket.off("callEnded");
            socket.off("callCanceled");
        };
    }, [socket]);

    return (
        <CallContext.Provider value={{
            callState,
            localStream,
            remoteStream,
            isAudioEnabled,
            isVideoEnabled,
            callType,
            callerInfo,
            initiateCall,
            answerCall,
            rejectCall,
            endCall,
            toggleAudio,
            toggleVideo
        }}>
            {children}
        </CallContext.Provider>
    );
};

export const useCall = () => useContext(CallContext);
