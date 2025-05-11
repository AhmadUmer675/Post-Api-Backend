import { Router } from "express";
import * as authController from "../Controllers/authcontroller";

const router = Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);

export default router;
