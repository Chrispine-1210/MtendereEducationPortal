import { Request, Response, NextFunction } from "express";

export class ApplicationController {
  static async listApplications(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all applications
    res.json({ applications: [] });
  }

  static async getApplication(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return application by id
    res.json({ application: null });
  }
}
