import express from "express";
import { uploadPDF } from "../controllers/pdfController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/upload", authMiddleware, uploadPDF);
// router.get("/", authMiddleware, getPDFs);
// router.get("/:id", authMiddleware, getPDFById);
export default router;
