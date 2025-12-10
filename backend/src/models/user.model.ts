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
    { expiresIn: "10d" }
  );
  return token;
};

userSchema.methods.generateAccessToken = function() {
  const jwt = require("jsonwebtoken");
  const token = jwt.sign(
    { userId: this._id, username: this.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  return token;
}

userSchema.methods.isPasswordCorrect = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", function (next: (err?: any) => void) {
  const bcrypt = require("bcryptjs");

  if (!this.isModified("password")) return next();

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);

    this.password = hash;
    next();
  });
});




const User = mongoose.model<IUserModel>("User", userSchema);
export default User;