import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import passport from "passport";
import { AuthService } from "./auth.service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await AuthService.registerUser(data.email, data.password);
      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const user = await AuthService.validateUser(data.email, data.password);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      const token = await AuthService.generateJWT(user);
      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response) {
    // If using JWT, user is attached to req.user by passport-jwt
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    res.json({ user: req.user });
  }
}
