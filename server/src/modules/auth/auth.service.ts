import { db } from "../../config/db";
import { users } from "../../schema/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export const register = async (data: any) => {
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await db.insert(users).values({
    name: data.name,
    email: data.email,
    password: hashed,
    role: "user",
  }).returning();
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await db.select().from(users).where(eq(users.email, email)).then(r => r[0]);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  return { user, token };
};

export const getProfile = async (id: number) =>
  db.select().from(users).where(eq(users.id, id)).then(r => r[0]);
