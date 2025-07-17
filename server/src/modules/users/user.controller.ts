import { Request, Response, NextFunction } from "express";

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return user profile
    res.json({ user: req.user });
  }

  static async listUsers(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all users
    res.json({ users: [] });
  }
}
