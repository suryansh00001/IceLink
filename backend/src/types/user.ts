import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  isOnline: boolean;
  socketId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}