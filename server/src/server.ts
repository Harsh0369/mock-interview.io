import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000


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