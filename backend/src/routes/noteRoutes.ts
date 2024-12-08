import express from "express";
import { addNote } from "../controllers/notesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:pdfId/notes", authMiddleware, addNote);
export default router;
