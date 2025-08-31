import { Router } from "express";
import { authenticateToken } from "../../middleware/auth";
import { sendPlannerInvitation } from "./sendInvitation";
import { listPlannerInvitations } from "./listInvitations";
import { respondPlannerInvitation } from "./respondInvitation";
import { getAvailableRoles } from "./getAvailableRoles";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Send a planner invitation
router.post("/send", sendPlannerInvitation);

// List sent and received invitations
router.get("/list", listPlannerInvitations);

// Get available roles for inviting
router.get("/available-roles/:eventId", getAvailableRoles);

// Accept or reject an invitation
router.post("/:invitationId/:action", respondPlannerInvitation);

export default router;
