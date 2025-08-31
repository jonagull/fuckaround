"use client";

import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface InvitationListProps {
  eventId: string;
}

// TODO: Implement guest invitations when backend is ready
export function InvitationList({ eventId }: InvitationListProps) {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground">Guest invitation system coming soon...</p>
      </CardContent>
    </Card>
  );
}