import { EventRole } from "weddingplanner-types";

// Define role hierarchy - higher index means higher privilege
const roleHierarchy: EventRole[] = [
  EventRole.GUEST,
  EventRole.VENDOR,
  EventRole.PLANNER,
  EventRole.OWNER,
];

/**
 * Check if a user with sourceRole can invite someone to targetRole
 * Users can only invite to their role level or below
 */
export function canInviteToRole(sourceRole: EventRole | string, targetRole: EventRole | string): boolean {
  const sourceIndex = roleHierarchy.indexOf(sourceRole as EventRole);
  const targetIndex = roleHierarchy.indexOf(targetRole as EventRole);
  
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
export function getAvailableRolesToInvite(userRole: EventRole | string): EventRole[] {
  const userIndex = roleHierarchy.indexOf(userRole as EventRole);
  
  if (userIndex === -1) {
    return [];
  }
  
  // Return all roles at or below the user's level
  return roleHierarchy.slice(0, userIndex + 1);
}