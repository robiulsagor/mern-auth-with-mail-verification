import bcryptjs from "bcryptjs";
import crypto from "crypto";

import {
  sendForgotPasswordMail,
  sendPasswordResetSuccessMail,
  sendVerificationMail,
  sendWelcomeMail,
} from "../mailtrap/email.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetupCookie } from "../utils/generateTokenAndSetupCookie.js";

export const checkAuth = async (req, res) => {
  res.send(req.userId);
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken: Math.floor(100000 + Math.random() * 900000).toString(),
      verificationExpiresAt: Date.now() + 3600000,
    });

    await newUser.save();
    generateTokenAndSetupCookie(res, newUser);

    await sendVerificationMail(email, newUser.verificationToken);

    const { password: pass, ...userData } = newUser._doc;

    return res.status(201).json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("All fields are required");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    generateTokenAndSetupCookie(res, user._id);

    const { password: pass, ...userData } = user._doc;

    return res.status(201).json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const signout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;
  if (!verificationToken) {
    throw new Error("Verification token is required");
  }

  try {
    const user = await User.findOne({
      verificationToken,
      verificationExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();
    await sendWelcomeMail(user.email, user.name);

    const { password, ...otherFields } = user._doc;
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      otherFields,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
    await sendForgotPasswordMail(user.email, resetURL);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong resetting password!",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    // if token is not valid
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendPasswordResetSuccessMail(user.email);

    res.clearCookie("token").status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error reseting password!",
    });
  }
};
