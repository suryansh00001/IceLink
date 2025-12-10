import mongoose  from "mongoose";
import { IUser } from "../types/user";
import bcrypt from "bcryptjs";



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

  refreshToken: { 
    type: String, 
    default: null 
  },

  socketId: { 
    type: String, 
    default: null 
  }
} , { timestamps: true });

userSchema.methods.generateAccessToken = function() {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function() {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { userId: this._id, username: this.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

userSchema.methods.isPasswordCorrect = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function () {
  const user = this as any;
  // only hash when password is modified or on new user
  if (!user.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});



const User = mongoose.model<IUserModel>("User", userSchema);
export default User;