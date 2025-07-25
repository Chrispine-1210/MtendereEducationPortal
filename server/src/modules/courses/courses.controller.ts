import { Request, Response } from "express";
import * as courseService from "./courses.service";
import { uploadToS3 } from "../../utils/s3";

export const getCourses = async (req: Request, res: Response) => {
  const data = await courseService.getAllCourses();
  res.json(data);
};

export const getCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await courseService.getCourseById(parseInt(id));
  res.json(data);
};

export const createCourse = async (req: any, res: Response) => {
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToS3(req.file, "courses");
  }
  const data = await courseService.createCourse({
    ...req.body,
    imageUrl,
  });
  res.status(201).json(data);
};

export const updateCourse = async (req: any, res: Response) => {
  const { id } = req.params;
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToS3(req.file, "courses");
  }
  const data = await courseService.updateCourse(parseInt(id), {
    ...req.body,
    ...(imageUrl && { imageUrl }),
  });
  res.json(data);
};

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await courseService.deleteCourse(parseInt(id));
  res.json(data);
};
