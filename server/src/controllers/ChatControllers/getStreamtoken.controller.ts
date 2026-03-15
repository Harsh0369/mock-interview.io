import { streamClient } from "../../config/stream.js";
import { Request, Response } from "express";

export const getStreamToken = async (req: Request, res: Response) => {
    try {
        const {clerkId} = req.user!;

        const token = streamClient.createToken(clerkId);
        res.json({ token });
    }
    catch (err)    {
        console.error("Error generating Stream token:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}