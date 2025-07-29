// src/controllers/users.controller.ts
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../services/users.service";
import { handleResponse } from "../utils/response";


export class UsersController {
  // ✅ Get all users
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UsersService.getAllUsers();
      return handleResponse(res, 200, "Users fetched successfully", users);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Get single user by ID
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const user = await UsersService.getUserById(id);
      return handleResponse(res, 200, "User fetched successfully", user);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Update a user
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updated = await UsersService.updateUser(id, req.body);
      return handleResponse(res, 200, "User updated successfully", updated);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Delete a user
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await UsersService.deleteUser(id);
      return handleResponse(res, 200, "User deleted successfully");
    } catch (err) {
      next(err);
    }
  }


  // ✅ Register new user
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const data = await UsersService.registerUser(name, email, password);
      return handleResponse(res, 201, "User registered successfully", data);
    } catch (err) {
      next(err);
    }
  }


  // ✅ Login user
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await UsersService.loginUser(email, password);
      return handleResponse(res, 200, "Login successful", data);
    } catch (err) {
      next(err);
    }
  }
}

