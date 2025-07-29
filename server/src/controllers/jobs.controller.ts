// src/controllers/jobs.controller.ts
import { Request, Response, NextFunction } from "express";
import { JobsService } from "../services/jobs.service";
import { handleResponse } from "../utils/response";
import { uploadToS3 } from "../utils/s3";


export class JobsController {
  // ✅ Get all jobs
  static async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await JobsService.getAllJobs();
      return handleResponse(res, 200, "Jobs fetched successfully", jobs);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Get a single job by ID
  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const job = await JobsService.getJobById(id);
      return handleResponse(res, 200, "Job fetched successfully", job);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Create a new job (with optional image upload)
  static async createJob(req: any, res: Response, next: NextFunction) {
    try {
      let imageUrl;
      if (req.file) {
        imageUrl = await uploadToS3(req.file, "jobs");
      }
      const job = await JobsService.createJob({
        ...req.body,
        ...(imageUrl && { imageUrl }),
      });
      return handleResponse(res, 201, "Job created successfully", job);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Update job (with optional image upload)
  static async updateJob(req: any, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      let imageUrl;
      if (req.file) {
        imageUrl = await uploadToS3(req.file, "jobs");
      }
      const updated = await JobsService.updateJob(id, {
        ...req.body,
        ...(imageUrl && { imageUrl }),
      });
      return handleResponse(res, 200, "Job updated successfully", updated);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Delete job
  static async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await JobsService.deleteJob(id);
      return handleResponse(res, 200, "Job deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}

