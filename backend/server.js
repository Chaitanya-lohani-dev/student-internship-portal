import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from './routes/admin.route.js';

dotenv.config()
connectDB();

const app = express();
const port = process.env.PORT || 5000;
const HOST = '127.0.0.1';

app.use(cookieParser())
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

app.get("/health", (_, res) => {
    res.status(200).json({message: 'all Systems normal'})
})
app.listen(port, HOST, () => {
    console.log(`Server is running on port ${port}`);
})
