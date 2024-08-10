import bcryptjs from "bcryptjs";
import { sendVerificationMail, sendWelcomeMail } from "../mailtrap/email.js";
import { User } from "../models/user.model.js";
import { generateTokenAndSetupCookie } from "../utils/generateTokenAndSetupCookie.js";

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

    generateTokenAndSetupCookie(res, user);

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
