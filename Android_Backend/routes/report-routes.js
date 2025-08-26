import express from "express";
import multer from "multer";
import { generateReport } from "../controller/report-controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

router.post("/generate-report", upload.array("reportfiles", 3), generateReport);

export default router;
