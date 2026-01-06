import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';

dotenv.config()
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/health", (_, res) => {
    res.status(200).json({message: 'all Systems normal'})
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
