"use client";

import { useGetInvitations, useDeleteInvitation, Invitation } from "weddingplanner-shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Clock, CheckCircle, XCircle } from "lucide-react";
import React from "react";

interface InvitationListProps {
  eventId: string;
}

export function InvitationList({ eventId }: InvitationListProps) {
  const { data: invitations, isLoading } = useGetInvitations(eventId);
  const deleteInvitation = useDeleteInvitation();

  const handleDelete = async (invitationId: string) => {
    if (confirm("Are you sure you want to delete this invitation?")) {
      try {
        await deleteInvitation.mutateAsync({ invitationId, eventId });
      } catch (error) {
        console.error("Failed to delete invitation:", error);
      }
    }
  };

  const getStatusBadge = (invitation: Invitation) => {
    if (invitation.acceptedAt) {
      return <Badge className="bg-green-500">Accepted</Badge>;
    }
    if (invitation.rejectedAt) {
      return <Badge className="bg-red-500">Rejected</Badge>;
    }
    return <Badge className="bg-yellow-500">Pending</Badge>;
  };

  const getStatusIcon = (invitation: Invitation) => {
    if (invitation.acceptedAt) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (invitation.rejectedAt) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    }
    return <Clock className="h-5 w-5 text-yellow-500" />;
  };

  if (isLoading) {
    return <div>Loading invitations...</div>;
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No invitations sent yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guest Invitations</CardTitle>
        <CardDescription>
          {invitations.length} invitation{invitations.length !== 1 ? "s" : ""} sent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between border rounded-lg p-4"
            >
              <div className="flex items-center space-x-4">
                <div>{getStatusIcon(invitation)}</div>
                <div>
                  <p className="font-medium">
                    {invitation.guestInfo.firstName} {invitation.guestInfo.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{invitation.guestInfo.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(invitation)}
                    {invitation.additionalGuestsCount > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <UserPlus className="h-3 w-3" />
                        +{invitation.additionalGuestsCount}
                      </Badge>
                    )}
                  </div>
                  {invitation.additionalGuests.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {invitation.additionalGuests.length} additional guest(s) confirmed
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(invitation.id)}
                disabled={deleteInvitation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
