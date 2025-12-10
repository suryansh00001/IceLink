import { Request, Response , NextFunction } from "express";
import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/apiError";
import User from "../models/user.model";
const JWT_SECRET = process.env.JWT_SECRET ;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers.authorization;
    const tokenFromHeader = bearerHeader?.startsWith("Bearer ")
    ? bearerHeader.split(" ")[1]
    : null;

const tokenFromCookie = req.cookies?.accessToken;

const token = tokenFromCookie || tokenFromHeader;

if (!token) return res.status(401).json(new ErrorResponse(401, "Unauthorized"));

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password -refreshToken");
        if (!user) {
            console.log("User not found for token:", decoded);
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");
            return res.status(401).json(new ErrorResponse(401, "Invalid token"));
        }
        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(401).json(new ErrorResponse(401, `middleware broke : ${error.message}`));
    }
};

export default verifyToken;