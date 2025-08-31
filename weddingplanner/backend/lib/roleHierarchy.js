"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canInviteToRole = canInviteToRole;
exports.getAvailableRolesToInvite = getAvailableRolesToInvite;
const weddingplanner_types_1 = require("weddingplanner-types");
// Define role hierarchy - higher index means higher privilege
const roleHierarchy = [
    weddingplanner_types_1.EventRole.GUEST,
    weddingplanner_types_1.EventRole.VENDOR,
    weddingplanner_types_1.EventRole.PLANNER,
    weddingplanner_types_1.EventRole.OWNER,
];
/**
 * Check if a user with sourceRole can invite someone to targetRole
 * Users can only invite to their role level or below
 */
function canInviteToRole(sourceRole, targetRole) {
    const sourceIndex = roleHierarchy.indexOf(sourceRole);
    const targetIndex = roleHierarchy.indexOf(targetRole);
    // If either role is not found, deny permission
    if (sourceIndex === -1 || targetIndex === -1) {
        return false;
    }
    // Can invite to same level or below
    return sourceIndex >= targetIndex;
}
/**
 * Get all roles that a user with the given role can invite to
 */
function getAvailableRolesToInvite(userRole) {
    const userIndex = roleHierarchy.indexOf(userRole);
    if (userIndex === -1) {
        return [];
    }
    // Return all roles at or below the user's level
    return roleHierarchy.slice(0, userIndex + 1);
}
