import { Router } from "express";
import { getStreamToken } from "../controllers/ChatControllers/index.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

export const chatRouter = Router();

chatRouter.get("/stream-token", protectRoute, getStreamToken);