import { Request, Response } from 'express';

export const getJobs = (req: Request, res: Response) => {
  // TODO: Replace with actual jobs logic
  res.json({ message: 'Jobs endpoint working!' });
};
