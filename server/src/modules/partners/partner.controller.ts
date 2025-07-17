import { Request, Response, NextFunction } from "express";

export class PartnerController {
  static async listPartners(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return all partners
    res.json({ partners: [] });
  }

  static async getPartner(req: Request, res: Response, next: NextFunction) {
    // Placeholder: return partner by id
    res.json({ partner: null });
  }
}
