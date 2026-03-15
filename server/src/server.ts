import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import { serve } from "inngest/express"
import { inngest, functions } from "./config/inngest.js"
import { clerkMiddleware } from "@clerk/express"
import { protectRoute } from "./middlewares/auth.middleware.js"
import { Request,Response } from "express"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use(clerkMiddleware()) // Add Clerk middleware for authentication

app.use("/api/inngest", serve({client:inngest, functions}))


const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }
    catch (err)
    {
        console.error("Error starting the server:", err);
        process.exit(1);
    }
}
startServer()