import { NextFunction, Request, Response } from "express";
import User from "../models/User.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

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

    // create token and store cookie
    res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        domain: "i-gpt.netlify.app",
        signed: true,
        path: "/",
      });
      const token = createToken(user._id.toString(), user.email, "7d");
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      res.cookie(COOKIE_NAME, token, {
        path: "/",
        domain: "i-gpt.netlify.app",
        expires,
        httpOnly: true,
        signed: true,
        sameSite:'none'
      });
      
    return res.status(201).json({ message: "ok",name:user.name, email:user.email });
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
    // res.clearCookie(COOKIE_NAME, {
    //   httpOnly: true,
    //   // domain: "i-gpt.netlify.app",
    //   signed: true,
    //   // path: "/",
    // });
    const token = createToken(user._id.toString(), user.email, "7d");
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    res.cookie(COOKIE_NAME, token, {
      // path: "/",
      // domain: "i-gpt.netlify.app",
      expires,
      httpOnly: true,
      // signed: true,
      sameSite: 'none',
      secure: true
    });
    return res.status(201).json({ message: "ok", name:user.name, email:user.email });
  } catch (error) {
    return res.status(500).json({ message: "error", cause: error.message });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or token malfunctioned");
    }
    if(user._id.toString() !== res.locals.jwtData.id){
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "ok", name:user.name, email:user.email });
  } catch (error) {
    return res.status(500).json({ message: "error", cause: error.message });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered or token malfunctioned");
    }
    if(user._id.toString() !== res.locals.jwtData.id){
      return res.status(401).send("Permissions didn't match");
    }
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: "i-gpt.netlify.app",
      signed: true,
      path: "/",
      sameSite: 'none',
      secure: true
    });
    return res.status(200).json({ message: "ok"});
  } catch (error) {
    return res.status(500).json({ message: "error", cause: error.message });
  }
};