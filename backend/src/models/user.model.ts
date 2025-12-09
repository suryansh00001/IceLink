import mongoose from "mongoose";
import { IUser } from "../types/user";

export interface IUserModel extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema<IUserModel>({
  username: { 
    type: String,
    required: true,
    unique: true 
},
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },

  avatarUrl: { 
    type: String ,
    default: ""
  },

  isOnline: { 
    type: Boolean, 
    default: false 
  },

  socketId: { 
    type: String, 
    default: null 
  }
} , { timestamps: true });

const User = mongoose.model<IUserModel>("User", userSchema);
export default User;