import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../../db";
import { eq } from "drizzle-orm";
// import your user table from drizzle schema
// import { users } from "../../schema";

export class AuthService {
  static async registerUser(email: string, password: string) {
    // Check if user exists
    // const existing = await db.select().from(users).where(eq(users.email, email)).first();
    // if (existing) throw new Error("User already exists");
    const hash = await bcrypt.hash(password, 10);
    // const [user] = await db.insert(users).values({ email, password: hash }).returning();
    // return user;
    // Placeholder:
    return { id: 1, email };
  }

  static async validateUser(email: string, password: string) {
    // const user = await db.select().from(users).where(eq(users.email, email)).first();
    // if (!user) return null;
    // const valid = await bcrypt.compare(password, user.password);
    // if (!valid) return null;
    // return user;
    // Placeholder:
    if (email === "test@example.com" && password === "password") return { id: 1, email };
    return null;
  }
x  static async generateJWT(user: { id: number; email: string }) {
    // Use env secret in production
    return jwt.sign({ sub: user.id, email: user.email }, "secret", { expiresIn: "1d" });
  }
}
