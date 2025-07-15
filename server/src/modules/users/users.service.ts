// server/src/modules/users/users.routes.ts
import { Router } from "express";
import * as controller from "./users.controller";

export const userRoutes = Router();

userRoutes.get("/", controller.getAllUsers);
userRoutes.get("/:id", controller.getUserById);
userRoutes.post("/", controller.createUser);
userRoutes.put("/:id", controller.updateUser);
userRoutes.delete("/:id", controller.deleteUser);

// --- controller ---
// server/src/modules/users/users.controller.ts
import { Request, Response } from "express";
import * as service from "./users.service";

export const getAllUsers = async (_req: Request, res: Response) => {
    const users = await service.findAll();
    res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
    const user = await service.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    const user = await service.create(req.body);
    res.status(201).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
    const updated = await service.update(req.params.id, req.body);
    res.json(updated);
};

export const deleteUser = async (req: Request, res: Response) => {
    await service.remove(req.params.id);
    res.status(204).send();
};

// --- service ---
// server/src/modules/users/users.service.ts
const db: any[] = []; // temporary in-memory DB

export const findAll = async () => db;

export const findById = async (id: string) => db.find(u => u.id === id);

export const create = async (data: any) => {
    const user = { id: Date.now().toString(), ...data };
    db.push(user);
    return user;
};

export const update = async (id: string, data: any) => {
    const i = db.findIndex(u => u.id === id);
    if (i === -1) return null;
    db[i] = { ...db[i], ...data };
    return db[i];
};

export const remove = async (id: string) => {
    const i = db.findIndex(u => u.id === id);
    if (i !== -1) db.splice(i, 1);
};

// --- schema ---
// server/src/modules/users/users.schema.ts
import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(["admin", "student", "partner"]),
});

export type User = z.infer<typeof userSchema>;
We

