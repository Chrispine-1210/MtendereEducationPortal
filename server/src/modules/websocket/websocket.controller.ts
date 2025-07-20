import { Request, Response } from "express";

export const sampleController = async (req: Request, res: Response) => {
  res.json({ message: "Sample controller in websocket module" });
};
