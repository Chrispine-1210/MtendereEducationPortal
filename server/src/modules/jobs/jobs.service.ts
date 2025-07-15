// --- controller ---
// server/src/modules/jobs/jobs.controller.ts
import { Request, Response } from "express";
import * as service from "./jobs.service";

export const getAll = async (_req: Request, res: Response) => {
    const jobs = await service.findAll();
    res.json(jobs);
};

export const getOne = async (req: Request, res: Response) => {
    const job = await service.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
};

export const create = async (req: Request, res: Response) => {
    const job = await service.create(req.body);
    res.status(201).json(job);
};

export const update = async (req: Request, res: Response) => {
    const updated = await service.update(req.params.id, req.body);
    res.json(updated);
};

export const remove = async (req: Request, res: Response) => {
    await service.remove(req.params.id);
    res.status(204).send();
};

// --- service ---
// server/src/modules/jobs/jobs.service.ts
const db: any[] = [];

export const findAll = async () => db;
export const findById = async (id: string) => db.find(j => j.id === id);

export const create = async (data: any) => {
    const job = { id: Date.now().toString(), ...data };
    db.push(job);
    return job;
};

export const update = async (id: string, data: any) => {
    const i = db.findIndex(j => j.id === id);
    if (i === -1) return null;
    db[i] = { ...db[i], ...data };
    return db[i];
};

export const remove = async (id: string) => {
    const i = db.findIndex(j => j.id === id);
    if (i !== -1) db.splice(i, 1);
};

// --- schema ---
// server/src/modules/jobs/jobs.schema.ts
import { z } from "zod";

export const jobSchema = z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    type: z.enum(["full-time", "part-time", "internship"]),
    description: z.string(),
});

export type Job = z.infer<typeof jobSchema>;


