import express from "express";
import { searchPDFs } from "../controllers/searchController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, searchPDFs);

export default router;
