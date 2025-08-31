"use client";

import { useState, useEffect } from "react";
import { useSendPlannerInvitation, EventRole, useGetEvent } from "weddingplanner-shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCurrentUser } from "./CurrentUserContext";

interface SendInvitationModalProps {
  eventId: string;
  eventName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper function to get available roles based on user's role
const getAvailableRoles = (userRole: string | number): EventRole[] => {
  const roleHierarchy: EventRole[] = [
    EventRole.GUEST,
    EventRole.VENDOR,
    EventRole.PLANNER,
    EventRole.OWNER,
  ];
  
  // Convert string role to number if needed
  let roleValue: number;
  if (typeof userRole === 'string') {
    // Map string to enum value
    const roleMap: Record<string, number> = {
      'OWNER': EventRole.OWNER,
      'PLANNER': EventRole.PLANNER,
      'VENDOR': EventRole.VENDOR,
      'GUEST': EventRole.GUEST,
    };
    roleValue = roleMap[userRole] ?? EventRole.GUEST;
  } else {
    roleValue = userRole;
  }
  
  const userIndex = roleHierarchy.indexOf(roleValue);
  if (userIndex === -1) return [EventRole.GUEST];
  
  return roleHierarchy.slice(0, userIndex + 1);
};

export function SendInvitationModal({
  eventId,
  eventName,
  open,
  onOpenChange,
}: SendInvitationModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState<EventRole>(EventRole.PLANNER);
  const sendInvitation = useSendPlannerInvitation();
  const { data: event } = useGetEvent(eventId);
  const { currentUser } = useCurrentUser();
  
  // Get current user's role in this event
  const currentUserPlanner = event?.planners?.find(
    p => p.userId === currentUser?.id
  );
  
  // Debug logging
  useEffect(() => {
    if (event && currentUser) {
      console.log("Current user ID:", currentUser.id);
      console.log("Event planners:", event.planners);
      console.log("Found planner:", currentUserPlanner);
    }
  }, [event, currentUser, currentUserPlanner]);
  
  const currentUserRole = currentUserPlanner?.role ?? EventRole.GUEST;
  
  const availableRoles = getAvailableRoles(currentUserRole);

  const handleSend = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    sendInvitation.mutate(
      {
        eventId,
        receiverEmail: email,
        role: selectedRole,
        message: message || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Invitation sent successfully!");
          setEmail("");
          setMessage("");
          onOpenChange(false);
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : "Failed to send invitation";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Planner</DialogTitle>
          <DialogDescription>
            Invite someone to help plan &ldquo;{eventName}&rdquo;
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="planner@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole.toString()} onValueChange={(value) => setSelectedRole(Number(value) as EventRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role.toString()}>
                    {role === EventRole.OWNER ? "Owner" :
                     role === EventRole.PLANNER ? "Planner" :
                     role === EventRole.VENDOR ? "Vendor" : "Guest"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Invite as {selectedRole === EventRole.OWNER ? "co-owner with full control" :
                        selectedRole === EventRole.PLANNER ? "planner to help organize" :
                        selectedRole === EventRole.VENDOR ? "vendor/service provider" : 
                        "guest with view access"}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={sendInvitation.isPending || !email}
          >
            {sendInvitation.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}