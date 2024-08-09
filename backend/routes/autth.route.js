import express from "express";
import { signin, signout, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});
router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signout);

export default router;
