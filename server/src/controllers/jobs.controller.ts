import { Request, Response } from "express";
import * as jobService from "../services/jobs.service";
import { uploadToS3 } from "../utils/s3";

export const getJobs = async (req: Request, res: Response) => {
  const data = await jobService.getAllJobs();
  res.json(data);
};

export const getJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await jobService.getJobById(parseInt(id));
  res.json(data);
};

export const createJob = async (req: any, res: Response) => {
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToS3(req.file, "jobs");
  }
  const data = await jobService.createJob({
    ...req.body,
    imageUrl,
  });
  res.status(201).json(data);
};

export const updateJob = async (req: any, res: Response) => {
  const { id } = req.params;
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToS3(req.file, "jobs");
  }
  const data = await jobService.updateJob(parseInt(id), {
    ...req.body,
    ...(imageUrl && { imageUrl }),
  });
  res.json(data);
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await jobService.deleteJob(parseInt(id));
  res.json(data);
};
