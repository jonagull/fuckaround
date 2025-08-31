import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import { createEventFunction } from "./createEvent";
import { getEventsFunction } from "./getEvents";
import { deleteEventFunction } from "./deleteEvent";

const router = Router();


router.post("/", authenticateToken, createEventFunction);
router.get("/", authenticateToken, getEventsFunction);
router.delete("/:eventId", authenticateToken, deleteEventFunction);

export default router;
