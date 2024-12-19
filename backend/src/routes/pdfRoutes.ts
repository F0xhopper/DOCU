import express from "express";
import multer from "multer";
import { getAllPDF, uploadPDF } from "../controllers/pdfController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure Multer
const storage = multer.memoryStorage(); // Stores file in memory (can also use diskStorage if preferred)
const upload = multer({ storage });

// Update the upload route to accept files
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"), // 'file' is the key name for the file in the request
  uploadPDF
);
router.get("/pdf/:id");
router.get("/", getAllPDF);
export default router;
