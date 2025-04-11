import mongoose from "mongoose";
import { config } from "dotenv";

config(); // Load environment variables

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables.");
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Database connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit process on failure
    }
};
