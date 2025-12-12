export interface IUser {
  _id: string;               
  username: string;
  email: string;
  avatarUrl?: string;
  isOnline: boolean;
  socketId?: string | null;
  createdAt: string;        
  updatedAt: string;
}
