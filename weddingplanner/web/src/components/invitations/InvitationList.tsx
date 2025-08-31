"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  useGetInvitations, 
  useDeleteInvitation, 
  useSendGuestInvitations,
  type GuestInvitation 
} from "weddingplanner-shared";
import { format } from "date-fns";
import { Mail, Phone, User, UserPlus, Trash2, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";

interface InvitationListProps {
  eventId: string;
}

export function InvitationList({ eventId }: InvitationListProps) {
  const { data: invitations, isLoading, error } = useGetInvitations(eventId);
  const deleteInvitation = useDeleteInvitation();
  const sendInvitations = useSendGuestInvitations();
  const [selectedInvitations, setSelectedInvitations] = useState<Set<string>>(new Set());

  const handleDelete = (invitationId: string, guestName: string) => {
    if (!confirm(`Are you sure you want to delete the invitation for ${guestName}?`)) {
      return;
    }

    deleteInvitation.mutate(
      { invitationId, eventId },
      {
        onSuccess: () => {
          toast.success("Invitation deleted successfully");
          setSelectedInvitations(prev => {
            const newSet = new Set(prev);
            newSet.delete(invitationId);
            return newSet;
          });
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete invitation";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleSelectAll = () => {
    if (!invitations) return;
    
    const unsent = invitations.filter((inv: GuestInvitation) => !inv.emailSentAt);
    if (selectedInvitations.size === unsent.length) {
      setSelectedInvitations(new Set());
    } else {
      setSelectedInvitations(new Set(unsent.map((inv: GuestInvitation) => inv.id)));
    }
  };

  const handleSelectOne = (invitationId: string) => {
    setSelectedInvitations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(invitationId)) {
        newSet.delete(invitationId);
      } else {
        newSet.add(invitationId);
      }
      return newSet;
    });
  };

  const handleSendInvitations = () => {
    if (selectedInvitations.size === 0) {
      toast.error("Please select at least one invitation to send");
      return;
    }

    const invitationIds = Array.from(selectedInvitations);
    
    sendInvitations.mutate(
      { invitationIds, eventId },
      {
        onSuccess: (data) => {
          toast.success(
            `Successfully sent ${data.successfullySent} invitation${data.successfullySent !== 1 ? 's' : ''}${
              data.failed > 0 ? `, ${data.failed} failed` : ''
            }`
          );
          setSelectedInvitations(new Set());
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : "Failed to send invitations";
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

  const unsentInvitations = invitations.filter((inv: GuestInvitation) => !inv.emailSentAt);
  const allUnsentSelected = unsentInvitations.length > 0 && 
    unsentInvitations.every((inv: GuestInvitation) => selectedInvitations.has(inv.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Guest Invitations</h3>
          <Badge variant="outline">{invitations.length} guests</Badge>
        </div>
        {selectedInvitations.size > 0 && (
          <Button 
            onClick={handleSendInvitations}
            disabled={sendInvitations.isPending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send {selectedInvitations.size} Invitation{selectedInvitations.size !== 1 ? 's' : ''}
          </Button>
        )}
      </div>

      {unsentInvitations.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
          <Checkbox
            checked={allUnsentSelected}
            onCheckedChange={handleSelectAll}
          />
          <label className="text-sm text-muted-foreground cursor-pointer" onClick={handleSelectAll}>
            Select all unsent invitations ({unsentInvitations.length})
          </label>
        </div>
      )}
      
      <div className="grid gap-4">
        {invitations.map((invitation: GuestInvitation) => (
          <Card key={invitation.id} className={selectedInvitations.has(invitation.id) ? "ring-2 ring-primary" : ""}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  {!invitation.emailSentAt && (
                    <Checkbox
                      checked={selectedInvitations.has(invitation.id)}
                      onCheckedChange={() => handleSelectOne(invitation.id)}
                      className="mt-1"
                    />
                  )}
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                      {invitation.guestFirstName} {invitation.guestLastName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Invited {format(new Date(invitation.invitedAt || invitation.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {invitation.emailSentAt && (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Email Sent
                    </Badge>
                  )}
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
              {invitation.emailSentAt && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Email sent on {format(new Date(invitation.emailSentAt), "MMM d, yyyy 'at' h:mm a")}
                </div>
              )}
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