import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { loginRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuser", loginRequired, getUser);

export default router;
