"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const sendInvitation_1 = require("./sendInvitation");
const listInvitations_1 = require("./listInvitations");
const respondInvitation_1 = require("./respondInvitation");
const getAvailableRoles_1 = require("./getAvailableRoles");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticateToken);
// Send a planner invitation
router.post("/send", sendInvitation_1.sendPlannerInvitation);
// List sent and received invitations
router.get("/list", listInvitations_1.listPlannerInvitations);
// Get available roles for inviting
router.get("/available-roles/:eventId", getAvailableRoles_1.getAvailableRoles);
// Accept or reject an invitation
router.post("/:invitationId/:action", respondInvitation_1.respondPlannerInvitation);
exports.default = router;
