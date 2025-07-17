import { Request, Response, NextFunction } from "express";

export class WebSocketController {
  static async status(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return websocket status
    res.json({ status: "ok" });
  }
}
