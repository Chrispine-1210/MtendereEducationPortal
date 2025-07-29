import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// ✅ Protect route middleware
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded; // attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// ✅ Admin route middleware
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== "admin") {
    return res.status(403).json({ message: "Not authorized as admin" });
  }
  next();
};
