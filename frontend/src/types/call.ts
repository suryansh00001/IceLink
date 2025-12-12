import { IUser } from "./user";

export interface ICall {
  _id: string;
  caller: IUser;                   
  receiver: IUser;                   
  callType: "audio" | "video";
  status: "ongoing" | "ended" | "missed" | "rejected";
  startedAt: string;                
  endedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
