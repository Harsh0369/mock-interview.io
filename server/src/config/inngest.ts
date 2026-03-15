import { Inngest, step } from "inngest";
import { connectDB } from "./db.js";
import { UserModel } from "../models/User.js";
import { User } from "../models/User.js";
import { upsertUser, deleteStreamUser } from "./stream.js";
import {sendEmail} from "./email.js";
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
        console.log(email_addresses);
        
        const userExists = await UserModel.findOne({ clerkId: id });
        if (userExists) {
            console.log(`User with clerkId ${id} already exists. Skipping creation.`);
            return;
        }
    
        
        const newUser: CreateUserInput = {
        clerkId: id,
        email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            profileImage: image_url
        }
        //Saving user to our DB
        await UserModel.create(newUser);
        //Creating stream instance of user
        await upsertUser({
            id: newUser.clerkId,
            name: newUser.name,
            profileImage: newUser.profileImage
        });
        //Sending welcome mail
        await step.run("send-welcome-email", async () => {
            await sendEmail(newUser.email, "Welcome to Mock Interview!", `
                <h1>Welcome to Mock Interview, ${newUser.name}!</h1>
                <p>We're excited to have you on board. If you have any questions or need assistance, feel free to reach out to our support team.</p>
                <p>Best regards,<br/>The Mock Interview Team</p>
            `);
        });
    })

const deleteUser = inngest.createFunction(
  { id: "delete-user" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    await connectDB();

    const { id } = event.data;

    // find user first
    const user = await UserModel.findOne({ clerkId: id });

    if (!user) {
      console.log("User not found in DB");
      return;
    }

    // delete from DB
    await UserModel.findOneAndDelete({ clerkId: id });

    // delete from Stream
    await deleteStreamUser(id);

    // send email
    await step.run("send-delete-email", async () => {
      await sendEmail(
        user.email,
        "Sorry to see you go!",
        `
        <h1>Goodbye from Mock Interview, ${user.name}!</h1>
        <p>We're sorry to see you go. If you have feedback or suggestions, please let us know.</p>
        <p>Best regards,<br/>The Mock Interview Team</p>
        `,
      );
    });
  },
);

export const functions = [syncUser, deleteUser];
