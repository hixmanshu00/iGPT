import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "ok", users });
  } catch (error) {
    return res.status(500).json({ message: "error", cause: error.message });
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("user already registered");
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = createToken(user._id.toString(), user.email, user.name, "7d");
    
    return res.status(201).json({ message: "ok",name:user.name, email:user.email, token });
  } catch (error) {
    return res.status(500).json({ message: "error", cause: error.message });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User not registered");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Incorrect Password");
    }
    const token = createToken(user._id.toString(), user.email, user.name, "7d");
    return res.status(201).json({ message: "ok", name:user.name, email:user.email, token:token });
  } catch (error) {
    return res.status(500).json({ message: "error", cause: error.message });
  }
};

