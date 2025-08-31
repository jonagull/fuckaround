"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Mail, Phone, Send, Grid3X3, List, ArrowUpDown } from "lucide-react";
import { CsvImportModal } from "@/components/guests/CsvImportModal";
import { AddGuestModal } from "@/components/guests/AddGuestModal";
import { useGetInvitations, useSendGuestInvitations } from "weddingplanner-shared";
import { useState, use } from "react";
import { toast } from "sonner";

export default function ProjectGuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvitations, setSelectedInvitations] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [sortBy, setSortBy] = useState<"name" | "status" | "email" | "date">("status");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { data: invitations, isLoading, error } = useGetInvitations(id);
  const sendInvitations = useSendGuestInvitations();

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

  // Sort filtered invitations
  const sortedInvitations = [...filteredInvitations].sort((a, b) => {
    let aValue: string | number | Date;
    let bValue: string | number | Date;

    switch (sortBy) {
      case "name":
        aValue = `${a.guestFirstName || ""} ${a.guestLastName || ""}`.toLowerCase();
        bValue = `${b.guestFirstName || ""} ${b.guestLastName || ""}`.toLowerCase();
        break;
      case "status":
        // Sort by status priority: PENDING (highest), ACCEPTED, REJECTED (lowest)
        const statusPriority = { PENDING: 3, ACCEPTED: 2, REJECTED: 1 };
        aValue = statusPriority[a.status as keyof typeof statusPriority] || 0;
        bValue = statusPriority[b.status as keyof typeof statusPriority] || 0;
        break;
      case "email":
        aValue = (a.guestEmail || "").toLowerCase();
        bValue = (b.guestEmail || "").toLowerCase();
        break;
      case "date":
        aValue = a.emailSentAt ? new Date(a.emailSentAt) : new Date(0);
        bValue = b.emailSentAt ? new Date(b.emailSentAt) : new Date(0);
        break;
      default:
        aValue = "";
        bValue = "";
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Handle select all
  const handleSelectAll = () => {
    if (selectedInvitations.size === sortedInvitations.length) {
      setSelectedInvitations(new Set());
    } else {
      setSelectedInvitations(new Set(sortedInvitations.map((inv) => inv.id)));
    }
  };

  // Handle individual selection
  const handleSelectInvitation = (invitationId: string) => {
    setSelectedInvitations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(invitationId)) {
        newSet.delete(invitationId);
      } else {
        newSet.add(invitationId);
      }
      return newSet;
    });
  };

  // Handle bulk send notifications
  const handleSendNotifications = () => {
    if (selectedInvitations.size === 0) {
      toast.error("Please select at least one guest to send notifications to");
      return;
    }

    const invitationIds = Array.from(selectedInvitations);
    sendInvitations.mutate(
      { invitationIds, eventId: id },
      {
        onSuccess: (response) => {
          toast.success(`Successfully sent ${response.successfullySent} notifications`);
          setSelectedInvitations(new Set());
        },
        onError: (error) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to send notifications";
          toast.error(errorMessage);
        },
      }
    );
  };

  // Get unsent invitations for select all functionality
  const unsentInvitations = sortedInvitations.filter((inv) => !inv.emailSentAt);
  const allUnsentSelected =
    unsentInvitations.length > 0 &&
    unsentInvitations.every((inv) => selectedInvitations.has(inv.id));

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

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
          <CsvImportModal projectId={id} />
          <AddGuestModal eventId={id} />
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

      {/* Controls Section */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search guests by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sort and View Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Sorting Controls */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status (Pending first)</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="email">Email (A-Z)</SelectItem>
                <SelectItem value="date">Date Sent</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="px-3"
              title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="ml-1 text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</span>
            <div className="flex rounded-md shadow-sm">
              <Button
                variant={viewMode === "detailed" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("detailed")}
                className="rounded-r-none border-r-0"
              >
                <List className="h-4 w-4 mr-2" />
                <span>Detailed</span>
              </Button>
              <Button
                variant={viewMode === "compact" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("compact")}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                <span>Compact</span>
              </Button>
            </div>
          </div>
        </div>
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
          {/* Bulk Actions */}
          {sortedInvitations.length > 0 && (
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={allUnsentSelected}
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedInvitations.size === 0
                        ? "Select guests to send notifications"
                        : `${selectedInvitations.size} guest${
                            selectedInvitations.size > 1 ? "s" : ""
                          } selected`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {allUnsentSelected ? "Deselect all" : "Select all unsent invitations"}
                    </p>
                  </div>
                </div>
                {selectedInvitations.size > 0 && (
                  <Button
                    onClick={handleSendNotifications}
                    disabled={sendInvitations.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {sendInvitations.isPending
                      ? "Sending..."
                      : `Send to ${selectedInvitations.size} guest${
                          selectedInvitations.size > 1 ? "s" : ""
                        }`}
                  </Button>
                )}
              </div>
            </Card>
          )}

          {sortedInvitations.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No guests found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search terms.</p>
            </div>
          ) : sortedInvitations.length === 0 && !searchTerm ? (
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
            sortedInvitations.map((invitation) => (
              <Card key={invitation.id} className={viewMode === "detailed" ? "p-6" : "p-2"}>
                {viewMode === "detailed" ? (
                  // Detailed View (Original)
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <Checkbox
                        checked={selectedInvitations.has(invitation.id)}
                        onCheckedChange={() => handleSelectInvitation(invitation.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
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
                          {invitation.emailSentAt && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                              Email Sent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            {invitation.guestEmail}
                          </div>
                          <div className="flex items-center">
                            <Phone className="mr-1 h-4 w-4" />
                            {invitation.guestPhoneCountryCode} {invitation.guestPhoneNumber}
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
                ) : (
                  // Compact View
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1">
                      <Checkbox
                        checked={selectedInvitations.has(invitation.id)}
                        onCheckedChange={() => handleSelectInvitation(invitation.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 h-4 w-4"
                      />
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                            {invitation.guestFirstName} {invitation.guestLastName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {invitation.guestEmail}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Badge
                            variant="secondary"
                            className={
                              invitation.status === "ACCEPTED"
                                ? "bg-green-100 text-green-700 text-xs px-1 py-0 h-5"
                                : invitation.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700 text-xs px-1 py-0 h-5"
                                : "bg-red-100 text-red-700 text-xs px-1 py-0 h-5"
                            }
                          >
                            {invitation.status === "ACCEPTED"
                              ? "✓"
                              : invitation.status === "PENDING"
                              ? "?"
                              : "✗"}
                          </Badge>
                          {invitation.additionalGuestsCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-700 text-xs px-1 py-0 h-5"
                            >
                              +{invitation.additionalGuestsCount}
                            </Badge>
                          )}
                          {invitation.emailSentAt && (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 text-xs px-1 py-0 h-5"
                            >
                              📧
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
