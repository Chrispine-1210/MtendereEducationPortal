import { Request, Response } from "express";
import * as applicationService from "../services/applications.service";
import { uploadToS3 } from "../utils/s3";
import { io } from "../socket"; // for real-time notifications

export const getApplications = async (req: Request, res: Response) => {
  const data = await applicationService.getAllApplications();
  res.json(data);
};

export const getUserApplications = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const data = await applicationService.getApplicationsByUser(userId);
  res.json(data);
};

export const getApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await applicationService.getApplicationById(parseInt(id));
  res.json(data);
};

export const createApplication = async (req: any, res: Response) => {
  let resumeUrl;
  if (req.file) {
    resumeUrl = await uploadToS3(req.file, "applications");
  }
  const data = await applicationService.createApplication({
    ...req.body,
    userId: req.user.id, // ensure logged in user
    resumeUrl,
  });

  io.emit("new-application", data); // emit real-time notification

  res.status(201).json(data);
};

export const updateApplication = async (req: any, res: Response) => {
  const { id } = req.params;
  let resumeUrl;
  if (req.file) {
    resumeUrl = await uploadToS3(req.file, "applications");
  }
  const data = await applicationService.updateApplication(parseInt(id), {
    ...req.body,
    ...(resumeUrl && { resumeUrl }),
  });
  res.json(data);
};

export const deleteApplication = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await applicationService.deleteApplication(parseInt(id));
  res.json(data);
};
