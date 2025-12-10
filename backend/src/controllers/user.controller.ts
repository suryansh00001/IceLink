import User from "../models/user.model";
import { Request, Response, CookieOptions } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/apiResponse";
import ErrorResponse from "../utils/apiError";
import { userInfo } from "os";
import uploadToCloudinary  from "../utils/uploadToCloudinary";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const generateTokens = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}

const registerUser = async (req,res) => {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
        return res.status(400).json(new ErrorResponse(400, "username, email and password are required"));
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(new ApiResponse(400, "User already exists"));
        }
        const newUser = new User({
            username,
            email,
            password,
        });
        await newUser.save();


        const { accessToken , refreshToken } = await generateTokens(newUser._id.toString());

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken");
        if (!createdUser) {
            return res.status(500).json(new ErrorResponse(500, "User creation failed"));
        }

        const cookieOptions: CookieOptions = {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };

        res
        .status(201)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(201, "User registered successfully", { user: createdUser, accessToken, refreshToken }));
    } catch (error) {
        res.status(500).json(new ErrorResponse(500, `Server error : ${error.message}`));
    }
};

const loginUser = async (req,res) => {
    try {
        console.log("Login request body:", req.body);
        const { email, password } = req.body || {};
        if(!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json(new ErrorResponse(400, "Email and password are required"));
        }
    
        const user = await User.findOne({ email });
        if(!user) {
            console.log("User not found for email:", email);
            return res.status(404).json(new ErrorResponse(404, "User not found"));
        }
    
        const isMatch = await user.isPasswordCorrect(password);
        if(!isMatch) {
            console.log("Invalid password for user:", email);
            return res.status(400).json(new ErrorResponse(400, "Invalid credentials"));
        }
    
        const { accessToken , refreshToken } = await generateTokens(user._id.toString());
    
        const cookieOptions: CookieOptions = {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
        if (!loggedInUser) {
            return res.status(500).json(new ErrorResponse(500, "Login failed"));
        }
    
        res
        .status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(new ApiResponse(200, "User logged in successfully", { user: loggedInUser, accessToken, refreshToken }));
    } catch (error: any) {
        console.error("Login error:", error.stack || error);
        return res.status(500).json(new ErrorResponse(500, `Server error : ${error.message}`));
    }
};



const logoutUser = async (req: Request, res: Response) => {
    const user= (req as any).user;
    if (!user) {
      return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }

    user.refreshToken = "";
    user.isOnline = false;
    user.socketId = null;
    await user.save({ validateBeforeSave: false });

    const CookieOptions = {
      secure: true,
      httpOnly: true,
      sameSite: "lax" as const
    };


    res
      .clearCookie("accessToken", CookieOptions)
      .clearCookie("refreshToken", CookieOptions)
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully"));
  };


const getCurrentUser = async (req: Request, res: Response) => {
    const user= (req as any).user;
    if (!user) {
      return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Current user fetched successfully", { user }));
};

const updateDetails = async (req: Request, res: Response) => {
    const user= (req as any).user;
    if (!user) {
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }

    const { username, email } = req.body;

    if (!username && !email) {
    return res.status(400).json(new ErrorResponse(400, "Nothing to update"));
    }


    if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json(new ErrorResponse(400, "Email already in use"));
    }


    const updateData: any = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

    


    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
            $set: updateData
        },
        { new: true}
    ).select("-password -refreshToken");

        

    res
      .status(200)
      .json(new ApiResponse(200, "User details updated successfully", { user: updatedUser }));
};

const updateAvatar = async (req: Request, res: Response) => {
    const user= (req as any).user;
    if (!user) {
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }
    if (!req.file) {
        return res.status(400).json(new ErrorResponse(400, "No file uploaded"));
    }

    const url = await uploadToCloudinary(req.file.buffer, "avatars");
    user.avatarUrl = url;
    await user.save({ validateBeforeSave: false });
    res
      .status(200)
      .json(new ApiResponse(200, "Avatar updated successfully", { avatarUrl: url }));
}

const changePassword = async (req: Request, res: Response) => {
    const authUser = (req as any).user;
    if (!authUser) {
        return res.status(401).json(new ErrorResponse(401, "Unauthorized"));
    }
    
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json(new ErrorResponse(400, "Current and new password are required"));
    }

    // Fetch user again WITH password field to verify current password
    const user = await User.findById(authUser._id).select("+password");
    if (!user) {
        return res.status(404).json(new ErrorResponse(404, "User not found"));
    }

    const isMatch = await user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
        return res.status(400).json(new ErrorResponse(400, "Current password is incorrect"));
    }

    user.password = newPassword;
    await user.save();

    res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
};

const googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    try {
        const { OAuth2Client } = require("google-auth-library");
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json(new ErrorResponse(400, "Invalid Google token"));
        }
        const { email, name, picture } = payload;

        if (!email) {
        return res.status(400).json(new ErrorResponse(400, "Google email is required"));
        }


        let user = await User.findOne({ email });

        

        if (!user) {
            user = new User({
                username: name?.replace(/\s+/g, "_").toLowerCase(),
                email,  
                password: payload.sub, // Use Google user ID as password (hashed in pre-save hook)
                avatarUrl: picture,
            });
            await user.save();
        }

        const { accessToken , refreshToken } = await generateTokens(user._id.toString());

        const options = { 
            secure: true, 
            httpOnly: true, 
            sameSite: "lax" as const, 
            maxAge: 7 * 24 * 60 * 60 * 1000 
        };

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
        if (!loggedInUser) {
            return res.status(500).json(new ErrorResponse(500, "Google login failed"));
        }

        res
        .status(200)
        .cookie("refreshToken", refreshToken , options )
        .cookie("accessToken", accessToken , options )
        .json(new ApiResponse(200, "User logged in with Google successfully", { user: loggedInUser , accessToken , refreshToken }));
    } catch (error) {
        return res.status(500).json(new ErrorResponse(500, `Google login error : ${error.message}`));
    }   
};


const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        console.log("=== Refresh Token Debug ===");
        console.log("Cookies:", req.cookies);
        console.log("Body:", req.body);
        
        // Accept from cookie OR body (for testing in Postman)
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!incomingRefreshToken) {
            console.log("No refresh token in cookies or body");
            return res.status(401).json(new ErrorResponse(401, "Refresh token missing"));
        }

        if (!process.env.REFRESH_TOKEN_SECRET) {
            return res.status(500).json(new ErrorResponse(500, "Server configuration error"));
        }

        const decoded = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ) as { userId: string };

        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json(new ErrorResponse(401, "Invalid refresh token"));
        }

        if (user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json(new ErrorResponse(401, "Refresh token expired or used"));
        }

        const { accessToken, refreshToken } = await generateTokens(user._id.toString());

        const options = {
            secure: true,
            httpOnly: true,
            sameSite: "lax" as const,
            maxAge: 7 * 24 * 60 * 60 * 1000
        };

        res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, "Access token refreshed", { accessToken, refreshToken }));

    } catch (error) {
        return res.status(401).json(new ErrorResponse(401, `Invalid or expired refresh token`));
    }
};




export { generateTokens,registerUser, loginUser, logoutUser, getCurrentUser, updateDetails , updateAvatar, changePassword, googleLogin, refreshAccessToken };