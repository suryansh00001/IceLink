const iceServers = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]
};

export const createPeerConnection = (): RTCPeerConnection => {
    return new RTCPeerConnection(iceServers);
};

export const getMediaStream = async (audio: boolean = true, video: boolean = true): Promise<MediaStream> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio,
            video: video ? { width: 1280, height: 720 } : false
        });
        return stream;
    } catch (error) {
        console.error("Error accessing media devices:", error);
        throw error;
    }
};

export const stopMediaStream = (stream: MediaStream | null) => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
};
