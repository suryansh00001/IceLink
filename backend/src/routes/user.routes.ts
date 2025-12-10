import { Router } from "express";
import verifyToken from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";
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
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser);
router.get("/me", verifyToken, getCurrentUser);
router.put("/update-details", verifyToken, updateDetails);
router.put("/update-avatar", verifyToken, upload.single("avatar"), updateAvatar);
router.put("/change-password", verifyToken, changePassword);
router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshAccessToken);


export default router;