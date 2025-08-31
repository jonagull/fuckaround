"use client";

import PageWrapper from "@/components/PageWrapper";
import { InvitationsList } from "@/components/InvitationsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function InvitationsPage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Planner Invitations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your event planning invitations
            </p>
          </div>
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
        </div>

        {/* Invitations List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Your Invitations</CardTitle>
            <CardDescription>
              Accept invitations to become a planner for events, or see the status of invitations you&apos;ve sent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvitationsList />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}