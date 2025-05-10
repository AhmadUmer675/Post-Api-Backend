import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}

interface TokenPayload extends JwtPayload {
  id: number;
}

const auth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const header = req.header("Authorization");
    if (!header) {
      res.status(401).json({
        success: false,
        message: "Authorization header required",
      });
      return;
    }

    const token = header.replace(/^Bearer\s+/i, "");
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Attach the user ID to the request
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or missing token",
    });
  }
};

export default auth;
