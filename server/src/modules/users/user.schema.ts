import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
});
