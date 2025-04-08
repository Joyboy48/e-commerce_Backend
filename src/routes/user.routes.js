import { Router } from "express";
import { loginUser, registerUser,logoutUser,forgotPassword,resetPassword } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)


//secure
router.route("/logout").post(verifyJWT,logoutUser)

router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password").post(resetPassword)
export default router