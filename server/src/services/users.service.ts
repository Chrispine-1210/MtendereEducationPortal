import { db } from "../config/db";
import { users } from "../schema/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};

export const registerUser = async (name: string, email: string, password: string) => {
  const userExists = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
  if (userExists) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const [newUser] = await db.insert(users).values({ name, email, password: hashedPassword }).returning();

  const token = generateToken(newUser.id, newUser.role);
  return { ...newUser, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
  if (!user) throw new Error("Invalid email or password");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password");

  const token = generateToken(user.id, user.role);
  return { ...user, token };
};

export const getAllUsers = () => db.select().from(users);

export const updateUser = (id: number, data: any) =>
  db.update(users).set(data).where(eq(users.id, id)).returning();

export const deleteUser = (id: number) =>
  db.delete(users).where(eq(users.id, id)).returning();
