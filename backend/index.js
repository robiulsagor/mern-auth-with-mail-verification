import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";

const app = express();

import { connectDB } from "./dbConnect/connect.js";
import authRoute from "./routes/auth.route.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  connectDB();
  console.log("App listening on port " + PORT + "!");
});
