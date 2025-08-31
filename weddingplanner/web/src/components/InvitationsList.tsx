"use client";

import { 
  usePlannerInvitations, 
  useAcceptPlannerInvitation, 
  useRejectPlannerInvitation,
  PlannerInvitationWithRelations 
} from "weddingplanner-shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Mail, User } from "lucide-react";
import { format } from "date-fns";

export function InvitationsList() {
  const { data, isLoading } = usePlannerInvitations();
  const acceptInvitation = useAcceptPlannerInvitation();
  const rejectInvitation = useRejectPlannerInvitation();

  const handleAccept = (invitationId: string, eventName: string) => {
    acceptInvitation.mutate(invitationId, {
      onSuccess: () => {
        toast.success(`You are now a planner for "${eventName}"!`);
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to accept invitation";
        toast.error(errorMessage);
      },
    });
  };

  const handleReject = (invitationId: string) => {
    rejectInvitation.mutate(invitationId, {
      onSuccess: () => {
        toast.success("Invitation declined");
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to decline invitation";
        toast.error(errorMessage);
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading invitations...</div>;
  }

  if (!data) {
    return null;
  }

  const { sent, received } = data;

  return (
    <div className="space-y-6">
      {/* Received Invitations */}
      {received && received.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pending Invitations</h3>
          <div className="grid gap-4">
            {received.map((invitation: PlannerInvitationWithRelations) => (
              <Card key={invitation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {invitation.event.eventName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Invited by {invitation.sender.name} as {
                          invitation.role === "OWNER" ? "Owner" :
                          invitation.role === "PLANNER" ? "Planner" :
                          invitation.role === "VENDOR" ? "Vendor" : "Guest"
                        }
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {invitation.message && (
                    <p className="text-sm text-muted-foreground mb-3">
                      &ldquo;{invitation.message}&rdquo;
                    </p>
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {invitation.sender.email}
                    </div>
                    {invitation.event.eventDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(invitation.event.eventDate), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(invitation.id, invitation.event.eventName)}
                      disabled={acceptInvitation.isPending}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(invitation.id)}
                      disabled={rejectInvitation.isPending}
                    >
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Sent Invitations */}
      {sent && sent.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Sent Invitations</h3>
          <div className="grid gap-4">
            {sent.map((invitation: PlannerInvitationWithRelations) => (
              <Card key={invitation.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">
                        {invitation.event.eventName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Sent to {invitation.receiver.name} as {
                          invitation.role === "OWNER" ? "Owner" :
                          invitation.role === "PLANNER" ? "Planner" :
                          invitation.role === "VENDOR" ? "Vendor" : "Guest"
                        }
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {invitation.receiver.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires {format(new Date(invitation.expiresAt), "MMM d, yyyy")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!received || received.length === 0) && (!sent || sent.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No invitations to display
        </div>
      )}
    </div>
  );
}