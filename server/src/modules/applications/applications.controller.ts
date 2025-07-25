import { Request, Response } from "express";
import * as applicationService from "./applications.service";

export const getApplications = async (req: Request, res: Response) => {
  const data = await applicationService.getAllApplications();
  res.json(data);
};

export const getUserApplications = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const data = await applicationService.getApplicationsByUser(userId);
  res.json(data);
};

export const createApplication = async (req: Request, res: Response) => {
  const data = await applicationService.createApplication(req.body);
  res.status(201).json(data);
};

export const updateApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await applicationService.updateApplication(parseInt(id), req.body);
  res.json(data);
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await applicationService.deleteApplication(parseInt(id));
  res.json(data);
};
