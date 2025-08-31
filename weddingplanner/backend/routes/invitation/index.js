"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const createInvitation_1 = require("./createInvitation");
const getInvitations_1 = require("./getInvitations");
const updateInvitation_1 = require("./updateInvitation");
const deleteInvitation_1 = require("./deleteInvitation");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Create a new invitation
router.post("/", createInvitation_1.createInvitationFunction);
// Get all invitations for an event
router.get("/event/:eventId", getInvitations_1.getInvitationsFunction);
// Update an invitation (accept/reject, add additional guests)
router.patch("/:invitationId", updateInvitation_1.updateInvitationFunction);
// Delete an invitation
router.delete("/:invitationId", deleteInvitation_1.deleteInvitationFunction);
exports.default = router;
