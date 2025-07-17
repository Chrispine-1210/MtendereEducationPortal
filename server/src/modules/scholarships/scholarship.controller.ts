import { Request, Response, NextFunction } from "express";

export class ScholarshipController {
  static async listScholarships(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all scholarships
    res.json({ scholarships: [] });
  }

  static async getScholarship(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return scholarship by id
    res.json({ scholarship: null });
  }
}
