import { Request, Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/apiError";
import User from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET ;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log("=== Auth Middleware Debug ===");
    console.log("Headers:", req.headers);
    console.log("Authorization header:", req.headers.authorization);
    console.log("Cookies:", req.cookies);
    
    const bearerHeader = req.headers.authorization;
    const tokenFromHeader = bearerHeader?.startsWith("Bearer ")
    ? bearerHeader.split(" ")[1]
    : null;

const tokenFromCookie = req.cookies?.accessToken;

const token = tokenFromCookie || tokenFromHeader;

console.log("Token from header:", tokenFromHeader ? "yes" : "no");
console.log("Token from cookie:", tokenFromCookie ? "yes" : "no");
console.log("Final token:", token ? "yes" : "no");

if (!token) return res.status(401).json(new ErrorResponse(401, "Unauthorized - no token"));

    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET not configured");
        }
        const decoded: any = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        const user = await User.findById(decoded.userId).select("-password -refreshToken");
        if (!user) {
            console.log("User not found for userId:", decoded.userId);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(401).json(new ErrorResponse(401, "Invalid token - user not found"));
        }
        (req as any).user = user;
        next();
    } catch (error: any) {
        console.error("Token verification error:", error.message);
        return res.status(401).json(new ErrorResponse(401, `Unauthorized: ${error.message}`));
    }
};

export default verifyToken;