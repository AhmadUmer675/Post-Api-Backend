import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../Models/index";

// Extend Express Request to include user payload
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; firstName?: string; lastName?: string; email?: string };
    }
  }
}

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body as {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      };

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, message: "Email already registered" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ firstName, lastName, email, password: hashedPassword });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

      const userResponse = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
      res.status(201).json({ success: true, message: "User registered successfully", data: { user: userResponse, token } });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ success: false, message: "Server error during signup" });
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      
      // Validate input data
      if (!email || !password) {
        res.status(400).json({ success: false, message: "Email and password are required" });
        return;
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
      }

      // Ensure user.password exists before comparing
      if (!user.password) {
        console.error("User password hash is null or undefined");
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ success: false, message: "Invalid email or password" });
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
      const userResponse = { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };

      res.json({ success: true, message: "Login successful", data: { user: userResponse, token } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Server error during login" });
    }
  }
}

export default new AuthController();