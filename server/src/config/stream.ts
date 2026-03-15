import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';

dotenv.config();

type StreamUser = {
    id: string;
    name: string;
    profileImage?: string;
}

export const streamClient = StreamChat.getInstance(process.env.STREAM_API_KEY!, process.env.STREAM_API_SECRET!);

export const upsertUser = async (userData:StreamUser) => {
    try {
        await streamClient.upsertUser(userData);
        console.log('User upserted successfully:', userData);
    }
    catch (error) {
        console.error('Error upserting user:', error);
    }
}

export const deleteStreamUser = async (userId:string) => {
    try {
        await streamClient.deleteUser(userId);
        console.log('User deleted successfully:', userId);
    }
    catch (error) {
        console.error('Error deleting user:', error);
    }
}