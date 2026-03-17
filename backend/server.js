import './config/env.config.js';
import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from './routes/admin.route.js';
import studentRoutes from './routes/student.route.js'
import cors from 'cors';
import { errorHandler } from "./middleware/errorHandler.middleware.js";

(async () => {
    await connectDB();
})();

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors({origin: process.env.ALLOWED_ORIGINS ||"http://localhost:3000", credentials: true}));

app.get("/health", (_, res) => {
    res.status(200).json({message: 'all Systems normal'})
})

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
