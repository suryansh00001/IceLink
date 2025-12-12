import { IUser } from "./user";
import { IMessage } from "./message";

export interface Ichat {
  _id: string;
  participants: IUser[];
  isGroupChat: boolean;
  groupChatName?: string;
  lastMessage?: IMessage | null;
  createdAt: string;
  updatedAt: string;
}
