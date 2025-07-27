import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../../config/db";
import { users } from "../../schema/users";
import { eq } from "drizzle-orm";
import * as testimonialService from "./testimonials.service";
import { uploadToS3 } from "../../utils/s3";

export interface AuthRequest extends Request {
  user?: any;
}

export const getTestimonials = async (req: Request, res: Response) => {
  const data = await testimonialService.getAllTestimonials();
  res.json(data);
};

export const createTestimonial = async (req: any, res: Response) => {
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToS3(req.file, "testimonials");
  }
  const data = await testimonialService.createTestimonial({
    ...req.body,
    imageUrl,
  });
  res.status(201).json(data);
};

export const updateTestimonial = async (req: any, res: Response) => {
  const { id } = req.params;
  let imageUrl;
  if (req.file) {
    imageUrl = await uploadToS3(req.file, "testimonials");
  }
  const data = await testimonialService.updateTestimonial(parseInt(id), {
    ...req.body,
    ...(imageUrl && { imageUrl }),
  });
  res.json(data);
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await testimonialService.deleteTestimonial(parseInt(id));
  res.json(data);
};


export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      const user = await db.select().from(users).where(eq(users.id, decoded.id)).then(rows => rows[0]);
      if (!user) throw new Error("User not found");

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};
