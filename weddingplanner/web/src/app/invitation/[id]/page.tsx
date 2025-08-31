"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetGuestInvitation,
  useAcceptGuestInvitation,
  useDeclineGuestInvitation,
  type AdditionalGuest,
  type AdditionalGuestInput
} from "weddingplanner-shared";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  UserPlus,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Minus
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function InvitationPage() {
  const params = useParams();
  const invitationId = params.id as string;

  const { data: invitation, isLoading, error } = useGetGuestInvitation(invitationId);
  const acceptInvitation = useAcceptGuestInvitation();
  const declineInvitation = useDeclineGuestInvitation();

  const [additionalGuestsCount, setAdditionalGuestsCount] = useState(0);
  const [additionalGuestNames, setAdditionalGuestNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAccept = async () => {
    setIsSubmitting(true);
    const additionalGuests: AdditionalGuestInput[] = additionalGuestNames
      .filter(name => name.trim())
      .map(name => ({ name: name.trim() }));

    acceptInvitation.mutate(
      { invitationId, additionalGuests },
      {
        onSuccess: () => {
          toast.success("Thank you for accepting the invitation!");
        },
        onError: (error) => {
          const errorMessage = error instanceof Error ? error.message : "Failed to accept invitation";
          toast.error(errorMessage);
        },
        onSettled: () => {
          setIsSubmitting(false);
        }
      }
    );
  };

  const handleDecline = async () => {
    setIsSubmitting(true);
    declineInvitation.mutate(invitationId, {
      onSuccess: () => {
        toast.success("We're sorry you can't make it. Thank you for letting us know.");
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Failed to decline invitation";
        toast.error(errorMessage);
      },
      onSettled: () => {
        setIsSubmitting(false);
      }
    });
  };

  const updateAdditionalGuests = (count: number) => {
    const newCount = Math.max(0, Math.min(count, 5)); // Max 5 additional guests
    setAdditionalGuestsCount(newCount);

    const newNames = [...additionalGuestNames];
    if (newCount > additionalGuestNames.length) {
      for (let i = additionalGuestNames.length; i < newCount; i++) {
        newNames.push("");
      }
    } else {
      newNames.splice(newCount);
    }
    setAdditionalGuestNames(newNames);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-full max-w-lg">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2 text-lg">Loading invitation...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <Card className="w-full max-w-lg">
          <CardContent className="text-center py-12">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Invitation Not Found</h2>
            <p className="text-muted-foreground">
              This invitation link may be invalid or expired. Please contact the event organizer for assistance.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasResponded = invitation.acceptedAt || invitation.rejectedAt;
  const isAccepted = invitation.acceptedAt;
  const isDeclined = invitation.rejectedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            You&apos;re Invited!
          </h1>
          <p className="text-lg text-gray-600">Join us for a special celebration</p>
        </div>

        {/* Event Details Card */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-3xl text-center">{invitation.eventName}</CardTitle>
            {invitation.eventDate && (
              <CardDescription className="text-center text-lg mt-2">
                {format(new Date(invitation.eventDate), "EEEE, MMMM d, yyyy")}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {invitation.eventDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">
                    {format(new Date(invitation.eventDate), "MMMM d, yyyy")}
                  </span>
                </div>
              )}

              {invitation.eventTime && (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{invitation.eventTime}</span>
                </div>
              )}

              {invitation.eventLocation && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">{invitation.eventLocation}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guest Information Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Guest Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {invitation.guestFirstName} {invitation.guestLastName}
              </div>
              {invitation.guestEmail && (
                <div>
                  <span className="font-semibold">Email:</span> {invitation.guestEmail}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Response Card */}
        {hasResponded ? (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Response Recorded</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              {isAccepted ? (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-700 mb-2">You&apos;re Attending!</h3>
                  <p className="text-gray-600">
                    Thank you for accepting the invitation. We look forward to seeing you!
                  </p>
                  {invitation.additionalGuests && invitation.additionalGuests.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-semibold mb-2">Additional Guests:</p>
                      <ul className="list-disc list-inside text-left">
                        {invitation.additionalGuests.map((guest: AdditionalGuest, index: number) => (
                          <li key={index}>{guest.firstName} {guest.lastName}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-700 mb-2">Unable to Attend</h3>
                  <p className="text-gray-600">
                    Thank you for letting us know. We&apos;ll miss you at the celebration!
                  </p>
                </>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Response recorded on {format(new Date(invitation.acceptedAt || invitation.rejectedAt || new Date()), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Will you be attending?</CardTitle>
              <CardDescription>Please let us know if you can join us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Additional Guests Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Additional Guests</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAdditionalGuests(additionalGuestsCount - 1)}
                      disabled={additionalGuestsCount === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{additionalGuestsCount}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAdditionalGuests(additionalGuestsCount + 1)}
                      disabled={additionalGuestsCount >= 5}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {additionalGuestsCount > 0 && (
                  <div className="space-y-2 pl-4">
                    {additionalGuestNames.map((name, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-gray-400" />
                        <Input
                          placeholder={`Guest ${index + 1} name`}
                          value={name}
                          onChange={(e) => {
                            const newNames = [...additionalGuestNames];
                            newNames[index] = e.target.value;
                            setAdditionalGuestNames(newNames);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Response Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAccept}
                  disabled={isSubmitting}
                  style={{
                    background: "linear-gradient(to right, rgb(34 197 94), rgb(16 185 129))",
                    color: "white",
                    border: "none"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, rgb(22 163 74), rgb(5 150 105))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(to right, rgb(34 197 94), rgb(16 185 129))";
                  }}
                >
                  {isSubmitting && acceptInvitation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Accept Invitation
                    </>
                  )}
                </Button>
                <Button
                  className="flex-1"
                  size="lg"
                  variant="destructive"
                  onClick={handleDecline}
                  disabled={isSubmitting}
                >
                  {isSubmitting && declineInvitation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-5 w-5" />
                      Decline
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
