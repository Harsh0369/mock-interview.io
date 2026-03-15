import { UserDocument } from "../models/User.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId?: string;
      };
      user?: UserDocument;
    }
  }
}

export {};