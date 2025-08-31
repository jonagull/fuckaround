"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Mail, Phone } from "lucide-react";
import { CsvImportModal } from "@/components/guests/CsvImportModal";
import { useGetInvitations } from "weddingplanner-shared";
import { useState } from "react";

export default function ProjectGuestsPage({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: invitations, isLoading, error } = useGetInvitations(params.id);

  // Calculate stats from live data
  const totalGuests = invitations
    ? invitations.reduce((total, inv) => {
        try {
          return total + 1 + (inv.additionalGuestsCount || 0);
        } catch {
          return total + 1;
        }
      }, 0)
    : 0;
  const confirmedGuests = invitations
    ? invitations
        .filter((inv) => inv.status === "ACCEPTED")
        .reduce((total, inv) => {
          try {
            return total + 1 + (inv.additionalGuestsCount || 0);
          } catch {
            return total + 1;
          }
        }, 0)
    : 0;
  const pendingGuests = invitations
    ? invitations
        .filter((inv) => inv.status === "PENDING")
        .reduce((total, inv) => {
          try {
            return total + 1 + (inv.additionalGuestsCount || 0);
          } catch {
            return total + 1;
          }
        }, 0)
    : 0;
  const declinedGuests = invitations
    ? invitations
        .filter((inv) => inv.status === "REJECTED")
        .reduce((total, inv) => {
          try {
            return total + 1 + (inv.additionalGuestsCount || 0);
          } catch {
            return total + 1;
          }
        }, 0)
    : 0;

  // Filter guests based on search term
  const filteredInvitations =
    invitations?.filter((inv) => {
      try {
        return (
          (inv.guestFirstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inv.guestLastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          (inv.guestEmail || "").toLowerCase().includes(searchTerm.toLowerCase())
        );
      } catch {
        return false;
      }
    }) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest List</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage guests for your event and track RSVPs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvImportModal projectId={params?.id} />
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold">!</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Error loading guests</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {error instanceof Error ? error.message : "An unexpected error occurred"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-100"
            >
              Refresh Page
            </Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">{confirmedGuests}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">?</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingGuests}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">✗</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-red-600">{declinedGuests}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search guests..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Loading guests...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we fetch your guest list.
          </p>
        </div>
      ) : (
        /* Guest List */
        <div className="space-y-4">
          {filteredInvitations.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No guests found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search terms.</p>
            </div>
          ) : filteredInvitations.length === 0 && !searchTerm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No guests yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start by adding your first guest or importing from CSV.
              </p>
            </div>
          ) : (
            filteredInvitations.map((invitation) => (
              <Card key={invitation.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {invitation.guestFirstName} {invitation.guestLastName}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={
                          invitation.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : invitation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {invitation.status === "ACCEPTED"
                          ? "Confirmed"
                          : invitation.status === "PENDING"
                          ? "Pending"
                          : "Declined"}
                      </Badge>
                      {invitation.additionalGuestsCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          +{invitation.additionalGuestsCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4" />
                        {invitation.guestEmail}
                      </div>
                      <div className="flex items-center">
                        <Phone className="mr-1 h-4 w-4" />+{invitation.guestPhoneCountryCode}{" "}
                        {invitation.guestPhoneNumber}
                      </div>
                      {invitation.eventDate && (
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          {new Date(invitation.eventDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {invitation.additionalGuests.length > 0 && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Additional guests:</span>{" "}
                        {invitation.additionalGuests
                          .map((guest) => `${guest.firstName} ${guest.lastName}`)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      Send Reminder
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
