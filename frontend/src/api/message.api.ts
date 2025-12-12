import axiosInstance from "./axiosInstance";
import { IMessage } from "../types/message";

const getMessagesByChatId = async (chatId: string): Promise<IMessage[]> => {
  const response = await axiosInstance.get(`/messages/${chatId}`);
  return response.data.data.messages;
};

const sendMessage = async (message: IMessage): Promise<IMessage> => {
    const response = await axiosInstance.post("/messages", message);
    return response.data.data.message;
};

const uploadMedia = async (file: File, chatId: string): Promise<IMessage> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId);
    const response = await axiosInstance.post("/messages/media", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.data.message;
};

export { getMessagesByChatId, sendMessage, uploadMedia };

