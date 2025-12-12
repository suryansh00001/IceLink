import axiosInstance from "./axiosInstance";
import { Ichat } from "../types/chat";

export const getUserChats = async (): Promise<Ichat[]> => {
  const response = await axiosInstance.get("/chats");
  return response.data.data.chats;
};


export const createChat = async (otherUserId: string): Promise<Ichat> => {
    const response = await axiosInstance.post("/chats", { otherUserId });
    return response.data.data.chat;
}

export const createGroupChat = async (name: string, participantIds: string[]): Promise<Ichat> => {
    const response = await axiosInstance.post("/chats/group", { groupChatName: name, participantIds });
    return response.data.data.chat;
}

export const renameGroupChat = async (chatId: string, newName: string): Promise<Ichat> => {
    const response = await axiosInstance.put(`/chats/group/${chatId}/rename`, { newName });
    return response.data.data.chat;
}   

export const addUserToGroupChat = async (chatId: string, userId: string): Promise<Ichat> => {
    const response = await axiosInstance.put(`/chats/group/${chatId}/adduser`, { userId });
    return response.data.data.chat;
}

export const removeUserFromGroupChat = async (chatId: string, userId: string): Promise<Ichat> => {
    const response = await axiosInstance.put(`/chats/group/${chatId}/removeuser`, { userId });
    return response.data.data.chat;
}


