import { Request, Response } from 'express';
import { NextFunction } from 'express';

export const sampleController = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'Sample controller working' });
  } catch (error) {
    next(error);
  }
};
