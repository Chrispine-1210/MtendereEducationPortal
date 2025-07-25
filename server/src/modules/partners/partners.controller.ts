import { Request, Response } from "express";
import * as partnerService from "./partners.service";

export const getPartners = async (req: Request, res: Response) => {
  const data = await partnerService.getAllPartners();
  res.json(data);
};

export const createPartner = async (req: Request, res: Response) => {
  const data = await partnerService.createPartner(req.body);
  res.status(201).json(data);
};

export const updatePartner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await partnerService.updatePartner(parseInt(id), req.body);
  res.json(data);
};

export const deletePartner = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await partnerService.deletePartner(parseInt(id));
  res.json(data);
};
