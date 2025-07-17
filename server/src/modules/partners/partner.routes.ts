import express from "express";
import { PartnerController } from "./partner.controller";

const router = express.Router();

router.get("/", PartnerController.listPartners);
router.get(":id", PartnerController.getPartner);

export default router;
