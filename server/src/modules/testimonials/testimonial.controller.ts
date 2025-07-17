import { Request, Response, NextFunction } from "express";

export class TestimonialController {
  static async listTestimonials(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all testimonials
    res.json({ testimonials: [] });
  }

  static async getTestimonial(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return testimonial by id
    res.json({ testimonial: null });
  }
}
