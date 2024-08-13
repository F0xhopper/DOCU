import express from "express";
import { addNote, getNotes } from "../controllers/notesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:pdfId/notes", authMiddleware, addNote);
router.get("/:pdfId/notes", authMiddleware, getNotes);

export default router;
