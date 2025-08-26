import express from "express";
import { handleChat } from "../controller/chat-controller.js";

const router = express.Router();

router.post("/chat", handleChat);

export default router;
