import { Request, Response, NextFunction } from 'express';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Example: Simple token check (replace with real auth logic)
  const token = req.headers['authorization'];
  if (!token || token !== 'your-secret-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
