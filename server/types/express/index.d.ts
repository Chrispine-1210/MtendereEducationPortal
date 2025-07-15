import { UserPayload } from "../../src/utils/jwt"; // Adjust path to your JWT decode type

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload | string; // Or whatever your decoded token returns
    }
  }
}
