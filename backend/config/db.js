import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection lost. Attempting to reconnect...');
});

export default connectDB;