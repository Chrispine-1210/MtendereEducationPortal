

// --- controller ---
// server/src/modules/scholarships/scholarships.controller.ts
import { Request, Response } from "express";
import * as service from "./scholarships.service";

export const getAll = async (_req: Request, res: Response) => {
    const data = await service.findAll();
    res.json(data);
};

export const getOne = async (req: Request, res: Response) => {
    const item = await service.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
};

export const create = async (req: Request, res: Response) => {
    const item = await service.create(req.body);
    res.status(201).json(item);
};

export const update = async (req: Request, res: Response) => {
    const item = await service.update(req.params.id, req.body);
    res.json(item);
};

export const remove = async (req: Request, res: Response) => {
    await service.remove(req.params.id);
    res.status(204).send();
};

// --- service ---
// server/src/modules/scholarships/scholarships.service.ts
const db: any[] = [];

export const findAll = async () => db;
export const findById = async (id: string) => db.find(item => item.id === id);

export const create = async (data: any) => {
    const item = { id: Date.now().toString(), ...data };
    db.push(item);
    return item;
};

export const update = async (id: string, data: any) => {
    const i = db.findIndex(item => item.id === id);
    if (i === -1) return null;
    db[i] = { ...db[i], ...data };
    return db[i];
};

export const remove = async (id: string) => {
    const i = db.findIndex(item => item.id === id);
    if (i !== -1) db.splice(i, 1);
};

// --- schema ---
// server/src/modules/scholarships/scholarships.schema.ts
import { z } from "zod";

export const scholarshipSchema = z.object({
    title: z.string(),
    description: z.string(),
    deadline: z.string(),
    amount: z.number(),
});

export type Scholarship = z.infer<typeof scholarshipSchema>;