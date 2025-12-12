import axiosInstance from "./axiosInstance";
import { IMessage } from "../types/message";

export const getMessagesByChatId = async (chatId: string): Promise<IMessage[]> => {
  const response = await axiosInstance.get(`/messages/${chatId}`);
  return response.data.data.messages;
};

