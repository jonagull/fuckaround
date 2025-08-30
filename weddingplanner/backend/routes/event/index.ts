import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import { createEventFunction } from "./createEvent";

export const router = Router();

router.post("/", authenticateToken, createEventFunction);
