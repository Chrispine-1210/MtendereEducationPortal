import { Request, Response } from "express";
import * as courseService from "./courses.service";

export const getCourses = async (req: Request, res: Response) => {
  const data = await courseService.getAllCourses();
  res.json(data);
};

export const createCourse = async (req: Request, res: Response) => {
  const data = await courseService.createCourse(req.body);
  res.status(201).json(data);
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await courseService.updateCourse(parseInt(id), req.body);
  res.json(data);
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await courseService.deleteCourse(parseInt(id));
  res.json(data);
};
