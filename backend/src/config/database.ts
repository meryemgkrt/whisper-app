import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri= process.env.ONGODB_URI;
        if(!mongoUri){
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("🎉MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}