import express from "express";
import {
  checkAuth,
  forgotPassword,
  resetPassword,
  signin,
  signout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

export default router;
