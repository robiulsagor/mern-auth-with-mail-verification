import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";

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
