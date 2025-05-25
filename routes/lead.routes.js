import express from "express";
import { generateForm } from "../controllers/lead.controller.js";

const router = express.Router();

router.post("/generate-form", generateForm); // POST /generate-form

export default router;
