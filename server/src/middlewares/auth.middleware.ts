import { requireAuth, getAuth } from "@clerk/express";
import { UserModel } from "../models/User.js";
import { Request, Response, NextFunction } from "express";

export const protectRoute = [
  requireAuth(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await UserModel.findOne({ clerkId: userId });

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;

      next();
    } catch (err) {
      console.error("Error in authentication middleware:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
];