// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { handleResponse } from "../utils/response";

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.register(email, password);
      return handleResponse(res, 201, "User registered successfully", user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      return handleResponse(res, 200, "Login successful", { token });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      // Example: If JWT middleware is added later
      const user = await AuthService.getCurrentUser(req.user?.id);
      return handleResponse(res, 200, "Current user fetched", user);
    } catch (err) {
      next(err);
    }
  }
}
