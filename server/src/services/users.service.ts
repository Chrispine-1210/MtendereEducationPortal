// src/services/users.service.ts
import { db } from "../config/db";
import { users } from "../models/users.model";
import { cacheGet, cacheSet, cacheDelete } from "../utils/cache";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";


const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "30d" });
};


export class UsersService {
  // ✅ Register new user
  static async registerUser(name: string, email: string, password: string) {
    const userExists = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
    if (userExists) throw new Error("User already exists");


    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({ name, email, password: hashedPassword }).returning();


    // ✅ Create JWT
    const token = generateToken(newUser.id, newUser.role);


    // ✅ Invalidate cached users list
    await cacheDelete("users:all");


    return { ...newUser, token };
  }


  // ✅ Login existing user
  static async loginUser(email: string, password: string) {
    const user = await db.select().from(users).where(eq(users.email, email)).then(rows => rows[0]);
    if (!user) throw new Error("Invalid email or password");


    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");


    const token = generateToken(user.id, user.role);
    return { ...user, token };
  }


  // ✅ Get all users (with caching)
  static async getAllUsers() {
    const cached = await cacheGet("users:all");
    if (cached) return cached;


    const allUsers = await db.select().from(users);
    await cacheSet("users:all", allUsers, 300); // cache for 5 minutes
    return allUsers;
  }


  // ✅ Get single user by ID (with caching)
  static async getUserById(id: number) {
    const cached = await cacheGet(`user:${id}`);
    if (cached) return cached;


    const user = await db.query.users.findFirst({ where: { id } });
    if (!user) throw new Error("User not found");


    await cacheSet(`user:${id}`, user, 300);
    return user;
  }


  // ✅ Update user & invalidate cache
  static async updateUser(id: number, data: Partial<typeof users.$inferInsert>) {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    await cacheDelete(`user:${id}`);
    await cacheDelete("users:all");
    return updatedUser;
  }


  // ✅ Delete user & invalidate cache
  static async deleteUser(id: number) {
    await db.delete(users).where(eq(users.id, id));
    await cacheDelete(`user:${id}`);
    await cacheDelete("users:all");
  }
}

