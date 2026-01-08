import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import router from "./routes/auth.route.js";

dotenv.config()
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cookieParser())
app.use(express.json());
app.use('/api/auth', router)

app.get("/health", (_, res) => {
    res.status(200).json({message: 'all Systems normal'})
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
