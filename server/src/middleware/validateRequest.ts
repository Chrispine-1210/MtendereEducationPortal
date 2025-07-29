import { Request, Response, NextFunction } from "express";

export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body); // Joi/Zod/Yup schema
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
  };
}
