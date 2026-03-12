import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { UserModel } from "../models/User.js";
import { User } from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

type CreateUserInput = Omit<User, "createdAt" | "updatedAt">


export const inngest = new Inngest({
    id: "mock-interview",
    eventKey: process.env.INNGEST_EVENT_KEY!,
 });

const syncUser = inngest.createFunction(
    { id: "sync-user" },
    { event: "clerk/user.created" },
    async({ event })=> {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url, } = event.data;
    
        
        const newUser: CreateUserInput = {
        clerkId: id,
        email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            profileImage: image_url
        }
        await UserModel.create(newUser);
    })

const deleteUser = inngest.createFunction(
    { id: "delete-user" },
    { event: "clerk/user.deleted" },
    async({ event })=> {
        await connectDB();
        const { id } = event.data;
        await UserModel.findOneAndDelete({ clerkId: id });
    }
)

export const functions = [syncUser, deleteUser];
