import { Request, Response, NextFunction } from "express";

export class AnalyticsController {
  static async getAnalytics(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return analytics data
    res.json({ analytics: [] });
  }
}
