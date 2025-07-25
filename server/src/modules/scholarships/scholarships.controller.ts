import { Request, Response } from "express";
import * as scholarshipService from "./scholarships.service";

export const getScholarships = async (req: Request, res: Response) => {
  const data = await scholarshipService.getAllScholarships();
  res.json(data);
};

export const createScholarship = async (req: Request, res: Response) => {
  const data = await scholarshipService.createScholarship(req.body);
  res.status(201).json(data);
};

export const updateScholarship = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await scholarshipService.updateScholarship(parseInt(id), req.body);
  res.json(data);
};

export const deleteScholarship = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await scholarshipService.deleteScholarship(parseInt(id));
  res.json(data);
};
