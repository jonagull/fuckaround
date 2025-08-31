"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle, CheckCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useBulkCreateInvitations, useParseCsvGuests } from "weddingplanner-shared";

interface CsvImportModalProps {
  projectId: string;
  onImportComplete?: () => void;
}

interface CsvGuest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  additionalGuestsCount: number;
}

export function CsvImportModal({ projectId, onImportComplete }: CsvImportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedGuests, setParsedGuests] = useState<CsvGuest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingGuest, setEditingGuest] = useState<CsvGuest | null>(null);
  const [isSendingInvitations, setIsSendingInvitations] = useState(false);

  const parseCsvGuests = useParseCsvGuests();
  const bulkCreateInvitations = useBulkCreateInvitations();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a valid CSV file");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      setParsedGuests([]);
      setEditingIndex(null);
      setEditingGuest(null);

      // Automatically parse the CSV file
      await parseCsvFile(selectedFile);
    }
  };

  const parseCsvFile = async (file: File) => {
    setIsParsing(true);
    setError(null);

    try {
      const result = await parseCsvGuests.mutateAsync({ csvFile: file });
      setParsedGuests(result);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file");
    } finally {
      setIsParsing(false);
    }
  };

  const handleEditGuest = (index: number) => {
    setEditingIndex(index);
    setEditingGuest({ ...parsedGuests[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingGuest) {
      const updatedGuests = [...parsedGuests];
      updatedGuests[editingIndex] = editingGuest;
      setParsedGuests(updatedGuests);
      setEditingIndex(null);
      setEditingGuest(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingGuest(null);
  };

  const handleDeleteGuest = (index: number) => {
    const updatedGuests = parsedGuests.filter((_, i) => i !== index);
    setParsedGuests(updatedGuests);
  };

  const handleBulkSendInvitations = async () => {
    if (parsedGuests.length === 0) return;

    setIsSendingInvitations(true);
    setError(null);

    try {
      // Convert CsvGuest to IRequestCreateInvitation format
      const invitations = parsedGuests.map((guest) => ({
        eventId: projectId,
        guestInfo: {
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email,
          phoneNumber: guest.phoneNumber,
          phoneCountryCode: guest.phoneCountryCode,
        },
        additionalGuestsCount: guest.additionalGuestsCount,
      }));

      const result = await bulkCreateInvitations.mutateAsync(invitations);
      console.log("Bulk invitations created:", result);

      // Show success message
      setSuccess(true);
      setError(null);

      // Call the completion callback if provided
      onImportComplete?.();

      // Close modal after a short delay
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitations");
    } finally {
      setIsSendingInvitations(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setParsedGuests([]);
    setError(null);
    setSuccess(false);
    setEditingIndex(null);
    setEditingGuest(null);
  };

  const downloadExampleCsv = () => {
    const csvContent = `FirstName,LastName,Email,PhoneNumber,PhoneCountryCode,AdditionalGuestsCount
John,Doe,john.doe@email.com,1234567890,+1,1
Jane,Smith,jane.smith@email.com,0987654321,+1,0
Michael,Johnson,michael.j@email.com,5551234567,+1,2
Sarah,Williams,sarah.w@email.com,4449876543,+44,0
David,Brown,david.brown@email.com,3335557777,+1,1`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "example_guests.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0"
        >
          <Upload className="mr-2 h-4 w-4" />
          Import Guests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Import Guests from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="csv-upload">Select CSV File</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadExampleCsv}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Download className="mr-1 h-3 w-3" />
                Download Example
              </Button>
            </div>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                CSV should contain: FirstName, LastName, Email, PhoneNumber, PhoneCountryCode,
                AdditionalGuestsCount (optional)
              </p>
              <p className="text-xs text-gray-500">
                💡 Download the example file above to see the correct format
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isParsing && (
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Parsing CSV file...</p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Parsed Guests List */}
          {success && parsedGuests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm">
                  CSV parsed successfully! Found {parsedGuests.length} guests.
                </span>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold">
                  Parsed Guests ({parsedGuests.length})
                </Label>
                <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
                  {parsedGuests.map((guest, index) => (
                    <div key={index} className="p-4 bg-white rounded-md border shadow-sm">
                      {editingIndex === index ? (
                        // Edit Mode
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">First Name</Label>
                              <Input
                                value={editingGuest?.firstName || ""}
                                onChange={(e) =>
                                  setEditingGuest((prev) =>
                                    prev ? { ...prev, firstName: e.target.value } : null
                                  )
                                }
                                className="h-9 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Last Name</Label>
                              <Input
                                value={editingGuest?.lastName || ""}
                                onChange={(e) =>
                                  setEditingGuest((prev) =>
                                    prev ? { ...prev, lastName: e.target.value } : null
                                  )
                                }
                                className="h-9 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Email</Label>
                            <Input
                              value={editingGuest?.email || ""}
                              onChange={(e) =>
                                setEditingGuest((prev) =>
                                  prev ? { ...prev, email: e.target.value } : null
                                )
                              }
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Phone Number</Label>
                              <Input
                                value={editingGuest?.phoneNumber || ""}
                                onChange={(e) =>
                                  setEditingGuest((prev) =>
                                    prev ? { ...prev, phoneNumber: e.target.value } : null
                                  )
                                }
                                className="h-9 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Country Code</Label>
                              <Input
                                value={editingGuest?.phoneCountryCode || ""}
                                onChange={(e) =>
                                  setEditingGuest((prev) =>
                                    prev ? { ...prev, phoneCountryCode: e.target.value } : null
                                  )
                                }
                                className="h-9 text-sm"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Additional Guests</Label>
                            <Input
                              type="number"
                              value={editingGuest?.additionalGuestsCount || 0}
                              onChange={(e) =>
                                setEditingGuest((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        additionalGuestsCount: parseInt(e.target.value) || 0,
                                      }
                                    : null
                                )
                              }
                              className="h-9 text-sm w-32"
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 px-4"
                            >
                              Save Changes
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="px-4"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="space-y-3">
                          {/* Header with name and badge */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {guest.firstName.charAt(0)}
                                    {guest.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {guest.firstName} {guest.lastName}
                                  </h3>
                                </div>
                              </div>
                              {guest.additionalGuestsCount > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-700 px-2 py-1"
                                >
                                  +{guest.additionalGuestsCount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditGuest(index)}
                                className="text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteGuest(index)}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-sm text-gray-900 truncate">{guest.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 text-gray-400">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-500">Phone</p>
                                <p className="text-sm text-gray-900">
                                  {guest.phoneCountryCode} {guest.phoneNumber}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-4">
                    Review and edit the parsed guests above. You can now send invitations to these
                    guests individually or in bulk.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleBulkSendInvitations}
                      disabled={isSendingInvitations}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-6"
                    >
                      {isSendingInvitations ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending Invitations...
                        </>
                      ) : (
                        `Send Invitations to All (${parsedGuests.length})`
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // TODO: Navigate to invitation creation with pre-filled data
                        console.log("Creating invitations for:", parsedGuests);
                      }}
                      className="px-6"
                    >
                      Create Invitations
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
