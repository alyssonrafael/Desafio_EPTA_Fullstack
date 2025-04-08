import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController";
import {
  validateInputlogin,
  validateInputRegiter,
} from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", validateInputRegiter, registerUser);
router.post("/login", validateInputlogin, loginUser);

export default router;
