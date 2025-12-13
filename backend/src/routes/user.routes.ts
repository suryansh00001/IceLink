import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";
import { authLimiter, uploadLimiter } from "../middlewares/rateLimiter.middleware";
import { validateRegistration, validateLogin, validateUpdateDetails, validateChangePassword } from "../middlewares/validation.middleware";
import { generateTokens,
         registerUser, 
         loginUser, 
         logoutUser, 
         getCurrentUser, 
         updateDetails , 
         updateAvatar, 
         changePassword,    
         googleLogin,
         refreshAccessToken } from "../controllers/user.controller";

const router = Router();
router.post("/register", authLimiter, validateRegistration, registerUser);
router.post("/login", authLimiter, validateLogin, loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/me", verifyToken, getCurrentUser);
router.put("/update-details", verifyToken, validateUpdateDetails, updateDetails);
router.put("/update-avatar", verifyToken, uploadLimiter, upload.single("avatar"), updateAvatar);
router.put("/change-password", verifyToken, authLimiter, validateChangePassword, changePassword);
router.post("/google-login", authLimiter, googleLogin);
router.post("/refresh-token", refreshAccessToken);


export default router;