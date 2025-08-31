"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetInvitations, useDeleteInvitation } from "weddingplanner-shared";
import { format } from "date-fns";
import { Mail, Phone, User, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface InvitationListProps {
  eventId: string;
}

export function InvitationList({ eventId }: InvitationListProps) {
  const { data: invitations, isLoading, error } = useGetInvitations(eventId);
  const deleteInvitation = useDeleteInvitation();

  const handleDelete = (invitationId: string, guestName: string) => {
    if (!confirm(`Are you sure you want to delete the invitation for ${guestName}?`)) {
      return;
    }

    deleteInvitation.mutate(
      { invitationId, eventId },
      {
        onSuccess: () => {
          toast.success("Invitation deleted successfully");
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete invitation";
          toast.error(errorMessage);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Loading invitations...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-500">Failed to load invitations</p>
        </CardContent>
      </Card>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No guest invitations yet. Create your first invitation above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Guest Invitations</h3>
        <Badge variant="outline">{invitations.length} guests</Badge>
      </div>
      
      <div className="grid gap-4">
        {invitations.map((invitation: any) => (
          <Card key={invitation.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-base font-medium">
                    {invitation.guestFirstName} {invitation.guestLastName}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Invited {format(new Date(invitation.invitedAt || invitation.createdAt), "MMM d, yyyy")}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    invitation.status === "ACCEPTED" ? "default" :
                    invitation.status === "REJECTED" ? "destructive" : "secondary"
                  }>
                    {invitation.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(invitation.id, `${invitation.guestFirstName} ${invitation.guestLastName}`)}
                    disabled={deleteInvitation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {invitation.guestEmail && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {invitation.guestEmail}
                  </div>
                )}
                {invitation.guestPhoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {invitation.guestPhoneCountryCode} {invitation.guestPhoneNumber}
                  </div>
                )}
                {invitation.additionalGuestsCount > 0 && (
                  <div className="flex items-center gap-1">
                    <UserPlus className="h-3 w-3" />
                    +{invitation.additionalGuestsCount} guest{invitation.additionalGuestsCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              {invitation.acceptedAt && (
                <div className="mt-2 text-sm text-green-600">
                  Accepted on {format(new Date(invitation.acceptedAt), "MMM d, yyyy")}
                </div>
              )}
              {invitation.rejectedAt && (
                <div className="mt-2 text-sm text-red-600">
                  Declined on {format(new Date(invitation.rejectedAt), "MMM d, yyyy")}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}