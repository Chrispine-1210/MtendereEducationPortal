  // src/services/auth.service.ts
import { db } from "../config/db";
import { users } from "../models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export class AuthService {
  static async register(email: string, password: string) {
    // ✅ Check if user exists
    const existingUser = await db.query.users.findFirst({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Insert into DB
    const [user] = await db.insert(users).values({ email, password: hashed }).returning();

    return { id: user.id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await db.query.users.findFirst({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    // ✅ Create JWT
    return jwt.sign({ id: user.id, email }, process.env.JWT_SECRET!, { expiresIn: "1d" });
  }

  static async getCurrentUser(userId?: number) {
    if (!userId) throw new Error("Unauthorized");
    const user = await db.query.users.findFirst({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    return user;
  }
}
