import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./dbConnect/connect.js";
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  connectDB();
  console.log("App listening on port " + PORT + "!");
});
