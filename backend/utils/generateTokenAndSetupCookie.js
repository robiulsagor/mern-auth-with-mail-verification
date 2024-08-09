import jwt from "jsonwebtoken";

export const generateTokenAndSetupCookie = (res, user) => {
  const token = jwt.sign({ _id: user }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("token", token, cookieOptions);
  return token;
};
