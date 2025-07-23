import { Request, Response } from "express";
import * as jobService from "./jobs.service";

export const getJobs = async (req: Request, res: Response) => {
  const data = await jobService.getAllJobs();
  res.json(data);
};

export const createJob = async (req: Request, res: Response) => {
  const data = await jobService.createJob(req.body);
  res.status(201).json(data);
};

export const updateJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await jobService.updateJob(parseInt(id), req.body);
  res.json(data);
};

export const deleteJob = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await jobService.deleteJob(parseInt(id));
  res.json(data);
};
