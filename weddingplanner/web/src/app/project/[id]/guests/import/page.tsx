"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
  ArrowLeft,
  Edit,
  Trash2,
  Send,
  Home,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useBulkCreateInvitations, useParseCsvGuests } from "weddingplanner-shared";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface CsvGuest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  additionalGuestsCount: number;
}

export default function CsvImportPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const projectId = params.id;

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

      // Navigate back to guests page after a short delay
      setTimeout(() => {
        router.push(`/project/${projectId}/guests`);
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link href="/project" className="flex items-center hover:text-gray-700 transition-colors">
          <Home className="h-4 w-4 mr-1" />
          Projects
        </Link>
        <span>/</span>
        <Link href={`/project/${projectId}`} className="hover:text-gray-700 transition-colors">
          Project Details
        </Link>
        <span>/</span>
        <Link
          href={`/project/${projectId}/guests`}
          className="flex items-center hover:text-gray-700 transition-colors"
        >
          <Users className="h-4 w-4 mr-1" />
          Guests
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Import CSV</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import Guests from CSV</h1>
            <p className="text-gray-600 mt-1">
              Upload a CSV file to import multiple guests at once
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* File Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
            <CardDescription>
              Select a CSV file containing guest information. The file should include columns for
              FirstName, LastName, Email, PhoneNumber, PhoneCountryCode, and AdditionalGuestsCount.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="csv-upload" className="text-base font-medium">
                Select CSV File
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadExampleCsv}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Download className="mr-2 h-4 w-4" />
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
          </CardContent>
        </Card>

        {/* Loading State */}
        {isParsing && (
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Parsing CSV file...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we process your file</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {success && parsedGuests.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="flex items-center gap-3 p-6">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h3 className="font-medium text-green-800">CSV Parsed Successfully!</h3>
                <p className="text-green-700 text-sm">
                  Found {parsedGuests.length} guests in your CSV file.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Parsed Guests Data Table */}
        {success && parsedGuests.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Parsed Guests ({parsedGuests.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Review and edit the parsed guests below. You can modify individual entries before
                  sending invitations.
                </p>
              </div>
            </div>

            <div className="rounded-md border bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Additional Guests</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedGuests.map((guest, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                value={editingGuest?.firstName || ""}
                                onChange={(e) =>
                                  setEditingGuest((prev) =>
                                    prev ? { ...prev, firstName: e.target.value } : null
                                  )
                                }
                                placeholder="First Name"
                                className="h-8 text-sm"
                              />
                              <Input
                                value={editingGuest?.lastName || ""}
                                onChange={(e) =>
                                  setEditingGuest((prev) =>
                                    prev ? { ...prev, lastName: e.target.value } : null
                                  )
                                }
                                placeholder="Last Name"
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">
                                {guest.firstName.charAt(0)}
                                {guest.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {guest.firstName} {guest.lastName}
                              </p>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editingGuest?.email || ""}
                            onChange={(e) =>
                              setEditingGuest((prev) =>
                                prev ? { ...prev, email: e.target.value } : null
                              )
                            }
                            placeholder="Email"
                            className="h-8 text-sm"
                          />
                        ) : (
                          <span className="text-gray-900 text-sm">{guest.email}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="flex gap-2">
                            <Input
                              value={editingGuest?.phoneCountryCode || ""}
                              onChange={(e) =>
                                setEditingGuest((prev) =>
                                  prev ? { ...prev, phoneCountryCode: e.target.value } : null
                                )
                              }
                              placeholder="+1"
                              className="h-8 text-sm w-16"
                            />
                            <Input
                              value={editingGuest?.phoneNumber || ""}
                              onChange={(e) =>
                                setEditingGuest((prev) =>
                                  prev ? { ...prev, phoneNumber: e.target.value } : null
                                )
                              }
                              placeholder="Phone"
                              className="h-8 text-sm"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-900 text-sm">
                            {guest.phoneCountryCode} {guest.phoneNumber}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
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
                            className="h-8 text-sm w-16"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            {guest.additionalGuestsCount > 0 ? (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5"
                              >
                                +{guest.additionalGuestsCount}
                              </Badge>
                            ) : (
                              <span className="text-gray-900 text-sm">0</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              className="bg-green-600 hover:bg-green-700 h-7 px-2 text-xs"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="h-7 px-2 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-7 w-7 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditGuest(index)}>
                                <Edit className="mr-2 h-3.5 w-3.5" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteGuest(index)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <Button
                onClick={handleBulkSendInvitations}
                disabled={isSendingInvitations}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 px-8 py-2"
              >
                {isSendingInvitations ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending Invitations...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invitations to All ({parsedGuests.length})
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline" onClick={resetForm}>
            Reset Form
          </Button>
          <div className="text-sm text-gray-500">
            {parsedGuests.length > 0 && `Ready to process ${parsedGuests.length} guests`}
          </div>
        </div>
      </div>
    </div>
  );
}
