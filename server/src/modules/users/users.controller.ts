import { Request, Response } from "express";
import * as userService from "./users.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const data = await userService.registerUser(name, email, password);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await userService.loginUser(email, password);
    res.json(data);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
