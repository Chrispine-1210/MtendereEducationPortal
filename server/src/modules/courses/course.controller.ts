import { Request, Response, NextFunction } from "express";

export class CourseController {
  static async listCourses(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all courses
    res.json({ courses: [] });
  }

  static async getCourse(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return course by id
    res.json({ course: null });
  }
}
