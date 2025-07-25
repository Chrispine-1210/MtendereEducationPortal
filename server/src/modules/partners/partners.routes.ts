import express from "express";
import * as partnerController from "./partners.controller";

const router = express.Router();

router.get("/", partnerController.getPartners);
router.post("/", partnerController.createPartner);
router.put("/:id", partnerController.updatePartner);
router.delete("/:id", partnerController.deletePartner);

export default router;
