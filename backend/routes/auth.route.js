import express from "express";
import {
  forgotPassword,
  resetPassword,
  signin,
  signout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);

export default router;
