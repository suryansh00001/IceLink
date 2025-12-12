import axiosInstance from "./axiosInstance";
import { Ichat } from "../types/chat";

export const getUserChats = async (): Promise<Ichat[]> => {
  const response = await axiosInstance.get("/chats");
  return response.data.data.chats;
};
