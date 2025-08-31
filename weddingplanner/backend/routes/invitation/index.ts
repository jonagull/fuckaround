import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import { createInvitationFunction } from "./createInvitation";
import { getInvitationsFunction } from "./getInvitations";
import { updateInvitationFunction } from "./updateInvitation";
import { deleteInvitationFunction } from "./deleteInvitation";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new invitation
router.post("/", createInvitationFunction);

// Get all invitations for an event
router.get("/event/:eventId", getInvitationsFunction);

// Update an invitation (accept/reject, add additional guests)
router.patch("/:invitationId", updateInvitationFunction);

// Delete an invitation
router.delete("/:invitationId", deleteInvitationFunction);

export default router;
