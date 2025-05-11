import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/index";

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, "your_jwt_secret", { expiresIn: "1d" });
  res.json({ token });
};
