import { Router, RequestHandler } from "express";
import authController from "../Controllers/authcontroller";

const router = Router();

// Signup route
router.post(
  "/signup",
  authController.signup as RequestHandler
);

// Login route
router.post(
  "/login",
  authController.login as RequestHandler
);

export default router;
