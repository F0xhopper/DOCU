import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/pdfs", pdfRoutes);
app.use("/pdfs", noteRoutes);
app.use("/search", searchRoutes);

export default app;
