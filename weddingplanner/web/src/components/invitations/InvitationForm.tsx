"use client";

import { useState } from "react";
import { useCreateInvitation, IRequestCreateInvitation } from "weddingplanner-shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";


interface InvitationFormProps {
  eventId: string;
  onSuccess?: () => void;
}

export function InvitationForm({ eventId, onSuccess }: InvitationFormProps) {
  const createInvitation = useCreateInvitation();
  const [formData, setFormData] = useState<IRequestCreateInvitation>({
    eventId,
    guestInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      phoneCountryCode: "+1",
    },
    additionalGuestsCount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createInvitation.mutateAsync(formData);
      // Reset form
      setFormData({
        eventId,
        guestInfo: {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          phoneCountryCode: "+1",
        },
        additionalGuestsCount: 0,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create invitation:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Invitation</CardTitle>
        <CardDescription>Invite a guest to your event</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.guestInfo.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guestInfo: { ...prev.guestInfo, firstName: e.target.value },
                  }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.guestInfo.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guestInfo: { ...prev.guestInfo, lastName: e.target.value },
                  }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.guestInfo.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  guestInfo: { ...prev.guestInfo, email: e.target.value },
                }))
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneCountryCode">Country Code</Label>
              <Input
                id="phoneCountryCode"
                value={formData.guestInfo.phoneCountryCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guestInfo: { ...prev.guestInfo, phoneCountryCode: e.target.value },
                  }))
                }
                placeholder="+1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.guestInfo.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    guestInfo: { ...prev.guestInfo, phoneNumber: e.target.value },
                  }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="additionalGuests">Additional Guests Allowed</Label>
            <Input
              id="additionalGuests"
              type="number"
              min="0"
              value={formData.additionalGuestsCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  additionalGuestsCount: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>

          <Button type="submit" disabled={createInvitation.isPending}>
            {createInvitation.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
