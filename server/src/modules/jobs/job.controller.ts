import { Request, Response, NextFunction } from "express";

export class JobController {
  static async listJobs(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all jobs
    res.json({ jobs: [] });
  }

  static async getJob(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return job by id
    res.json({ job: null });
  }
}
