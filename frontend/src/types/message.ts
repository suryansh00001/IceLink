import { IUser } from "./user";

export interface IMessage {
  _id: string;                         
  chatId: string;            
  sender: IUser;          
  content?: string;
  mediaUrl?: string | null;
  messageType: "text" | "image" | "video" | "file";
  createdAt: string;                  
  updatedAt: string;
}
