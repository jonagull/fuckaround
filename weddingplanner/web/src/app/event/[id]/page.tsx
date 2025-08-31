"use client";
import React, { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { useParams, useRouter } from "next/navigation";
import { useGetEvent, useDeleteEvent } from "weddingplanner-shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Heart,
  MapPin,
  Users,
  ArrowLeft,
  Edit,
  Settings,
  Users2,
  Gift,
  UtensilsCrossed,
  Phone,
  Mail,
  Globe,
  Clock,
  Trash,
  UserPlus,
  Send,
} from "lucide-react";
import Link from "next/link";
import { SendInvitationModal } from "@/components/SendInvitationModal";
import { InvitationForm } from "@/components/invitations/InvitationForm";
import { useCurrentUser } from "@/components/CurrentUserContext";
import { InvitationList } from "@/components/invitations/InvitationList";

export default function Event() {
  const { id } = useParams();
  const router = useRouter();
  const { data: event, isLoading, error } = useGetEvent(id as string);
  const { mutate: deleteEvent } = useDeleteEvent();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showInvitationForm, setShowInvitationForm] = useState(false);
  const { currentUser } = useCurrentUser();

  const handleDeleteEvent = () => {
    deleteEvent(id as string);
    setIsDeleteDialogOpen(false);
    router.push("/");
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-500"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !event) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Event Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The event you&apos;re looking for doesn&apos;t exist or there was an error loading it.
          </p>
          <Button onClick={() => router.back()} className="bg-rose-500 hover:bg-rose-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Not set";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatTime = (date: string | Date | null | undefined) => {
    if (!date) return "Not set";
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid time";
    }
  };

  // Get current user's role in this event
  const currentUserRole = event?.planners?.find((p) => p.userId === currentUser?.id)?.role;

  const isOwner = currentUserRole === 0; // EventRole.OWNER is 0
  const isPlanner = currentUserRole === 1; // EventRole.PLANNER is 1
  const canManageEvent = isOwner || isPlanner;

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button> */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {event.eventName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Event Details & Planning</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-300">
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete Event
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your event &quot;
                    {event.eventName}&quot; and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteEvent}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Event
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Main Event Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Overview Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900 dark:text-white">
                      {event.eventName}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {event.eventDescription || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Event Date</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(event.eventDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Clock className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Event Time</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(event.eventDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Venue</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {event.venueAddress?.street || "Venue not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <Users className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Event Status</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>Manage your event planning tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href={`/project/${id}/guests`}>
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <Users2 className="h-6 w-6 text-blue-500" />
                      <span className="text-sm">Guest List</span>
                    </Button>
                  </Link>
                  <Link href={`/project/${id}/table-planning`}>
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <UtensilsCrossed className="h-6 w-6 text-green-500" />
                      <span className="text-sm">Table Planning</span>
                    </Button>
                  </Link>
                  <Link href={`/project/${id}/events`}>
                    <Button variant="outline" className="w-full h-20 flex-col space-y-2">
                      <Calendar className="h-6 w-6 text-purple-500" />
                      <span className="text-sm">Timeline</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Event Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Event Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Your Role</span>
                  <Badge
                    variant={isOwner ? "default" : "secondary"}
                    className={`${
                      isOwner ? "bg-rose-500" : isPlanner ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  >
                    {isOwner
                      ? "Owner"
                      : isPlanner
                      ? "Planner"
                      : currentUserRole === 2
                      ? "Vendor"
                      : "Guest"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Planning Progress
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Created</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Updated</span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {event.updatedAt ? new Date(event.updatedAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Planners */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Event Planners</CardTitle>
                  {canManageEvent && (
                    <Button
                      size="sm"
                      onClick={() => setIsInviteModalOpen(true)}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.planners && event.planners.length > 0 ? (
                  event.planners.map((planner) => (
                    <div
                      key={planner.userId}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {planner.userName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {planner.role === 0
                              ? "Owner"
                              : planner.role === 1
                              ? "Planner"
                              : planner.role === 2
                              ? "Vendor"
                              : "Guest"}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={planner.role === 0 ? "default" : "outline"}
                        className={`text-xs ${
                          planner.role === 0
                            ? "bg-rose-500"
                            : planner.role === 1
                            ? "bg-blue-500"
                            : planner.role === 2
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {planner.role === 0
                          ? "Owner"
                          : planner.role === 1
                          ? "Planner"
                          : planner.role === 2
                          ? "Vendor"
                          : "Guest"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      No planners added yet
                    </p>
                    {canManageEvent && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsInviteModalOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Invite your first planner
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Contact phone not set</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Contact email not set</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Website not set</span>
                </div>
              </CardContent>
            </Card>

            {/* Weather Forecast Placeholder */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                  Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-6">
                <div className="text-3xl mb-2">🌤️</div>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Weather information will be available closer to the event date
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Timeline Preview */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Event Timeline</CardTitle>
            <CardDescription>Key moments and milestones for your special day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Ceremony</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Main wedding ceremony</p>
                </div>
                <Badge variant="outline">2:00 PM</Badge>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Reception</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wedding reception and dinner
                  </p>
                </div>
                <Badge variant="outline">6:00 PM</Badge>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">Dancing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">First dance and party</p>
                </div>
                <Badge variant="outline">8:00 PM</Badge>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href={`/project/${id}/events`}>
                <Button variant="outline" className="w-full">
                  View Full Timeline
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Guest Invitations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Guest Invitations
              </h2>
              {!showInvitationForm && (
                <Button
                  onClick={() => setShowInvitationForm(true)}
                  className="bg-rose-500 hover:bg-rose-600"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              )}
            </div>
            {showInvitationForm ? (
              <InvitationForm
                eventId={id as string}
                onSuccess={() => setShowInvitationForm(false)}
              />
            ) : (
              <InvitationList eventId={id as string} />
            )}
          </div>

          <div>
            {showInvitationForm && (
              <div className="mt-11">
                <InvitationList eventId={id as string} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Send Invitation Modal */}
      {event && (
        <SendInvitationModal
          eventId={event.id}
          eventName={event.eventName}
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
        />
      )}
    </PageWrapper>
  );
}

// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import {
//   Calendar,
//   Users,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Heart,
//   TableProperties,
//   Mail,
//   Camera,
// } from "lucide-react";

// export default function ProjectDashboard() {

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Sarah & John&apos;s Wedding
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 mt-2">
//             Project Overview • June 15, 2024 • Grand Ballroom, Downtown
//           </p>
//         </div>
//         <div className="flex items-center space-x-3">
//           <Badge className="bg-green-100 text-green-700">Active</Badge>
//           <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
//             <Camera className="mr-2 h-4 w-4" />
//             Add Photos
//           </Button>
//         </div>
//       </div>

//       {/* Key Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//               <Users className="h-6 w-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Guests</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">150</p>
//               <p className="text-xs text-green-600">127 confirmed</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//               <Calendar className="h-6 w-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Days Left</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
//               <p className="text-xs text-gray-600">Until the big day</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//               <CheckCircle className="h-6 w-6 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tasks Done</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">24/32</p>
//               <p className="text-xs text-purple-600">75% complete</p>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center">
//             <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
//               <span className="text-rose-600 font-bold text-lg">$</span>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Budget Used</p>
//               <p className="text-2xl font-bold text-gray-900 dark:text-white">$28k</p>
//               <p className="text-xs text-gray-600">of $35k total</p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Progress Overview */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//           Planning Progress
//         </h3>
//         <div className="space-y-4">
//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                 Overall Progress
//               </span>
//               <span className="text-sm text-gray-600 dark:text-gray-400">75%</span>
//             </div>
//             <Progress value={75} className="h-3" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-sm text-gray-600">Venue & Catering</span>
//                 <span className="text-sm text-green-600">100%</span>
//               </div>
//               <Progress value={100} className="h-2" />
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-sm text-gray-600">Photography</span>
//                 <span className="text-sm text-green-600">90%</span>
//               </div>
//               <Progress value={90} className="h-2" />
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-sm text-gray-600">Guest Management</span>
//                 <span className="text-sm text-blue-600">80%</span>
//               </div>
//               <Progress value={80} className="h-2" />
//             </div>
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <span className="text-sm text-gray-600">Decorations</span>
//                 <span className="text-sm text-yellow-600">45%</span>
//               </div>
//               <Progress value={45} className="h-2" />
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Quick Actions & Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//             Quick Actions
//           </h3>
//           <div className="space-y-3">
//             <Button className="w-full justify-start" variant="outline">
//               <Users className="mr-2 h-4 w-4" />
//               Send RSVP Reminders
//             </Button>
//             <Button className="w-full justify-start" variant="outline">
//               <TableProperties className="mr-2 h-4 w-4" />
//               Update Seating Chart
//             </Button>
//             <Button className="w-full justify-start" variant="outline">
//               <Calendar className="mr-2 h-4 w-4" />
//               Schedule Vendor Meeting
//             </Button>
//             <Button className="w-full justify-start" variant="outline">
//               <Mail className="mr-2 h-4 w-4" />
//               Send Thank You Cards
//             </Button>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//             Upcoming Events
//           </h3>
//           <div className="space-y-4">
//             <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//               <Calendar className="h-5 w-5 text-blue-600" />
//               <div className="flex-1">
//                 <p className="font-medium text-gray-900 dark:text-white">Cake Tasting</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">Tomorrow at 2:00 PM</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//               <Users className="h-5 w-5 text-green-600" />
//               <div className="flex-1">
//                 <p className="font-medium text-gray-900 dark:text-white">Final Guest Count</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">Due March 20th</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//               <Heart className="h-5 w-5 text-purple-600" />
//               <div className="flex-1">
//                 <p className="font-medium text-gray-900 dark:text-white">Rehearsal Dinner</p>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">June 14th at 6:00 PM</p>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* To-Do List */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h3>
//         <div className="space-y-3">
//           <div className="flex items-center space-x-3 p-3 border rounded-lg">
//             <CheckCircle className="h-5 w-5 text-green-600" />
//             <div className="flex-1">
//               <p className="font-medium text-gray-900 dark:text-white line-through">
//                 Book photographer
//               </p>
//               <p className="text-sm text-gray-600 dark:text-gray-300">Completed 2 days ago</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3 p-3 border rounded-lg">
//             <AlertCircle className="h-5 w-5 text-yellow-600" />
//             <div className="flex-1">
//               <p className="font-medium text-gray-900 dark:text-white">Order wedding favors</p>
//               <p className="text-sm text-gray-600 dark:text-gray-300">Due in 3 days</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3 p-3 border rounded-lg">
//             <Clock className="h-5 w-5 text-blue-600" />
//             <div className="flex-1">
//               <p className="font-medium text-gray-900 dark:text-white">Send save the dates</p>
//               <p className="text-sm text-gray-600 dark:text-gray-300">In progress</p>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }
