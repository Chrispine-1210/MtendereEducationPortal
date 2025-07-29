import client from "prom-client";
import { Router } from "express";

const router = Router();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

router.get("/", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;
