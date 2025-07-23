import { Request, Response } from "express";
import * as testimonialService from "./testimonials.service";

export const getTestimonials = async (req: Request, res: Response) => {
  const data = await testimonialService.getAllTestimonials();
  res.json(data);
};

export const createTestimonial = async (req: Request, res: Response) => {
  const data = await testimonialService.createTestimonial(req.body);
  res.status(201).json(data);
};

export const updateTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await testimonialService.updateTestimonial(parseInt(id), req.body);
  res.json(data);
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await testimonialService.deleteTestimonial(parseInt(id));
  res.json(data);
};
