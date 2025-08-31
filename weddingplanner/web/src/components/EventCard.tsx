import { Event, useDeleteEvent, useUpdateEvent } from "weddingplanner-shared";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Users, ArrowRight, Trash, Pencil } from "lucide-react";
import React, { useState } from "react";
import { Progress } from "./ui/progress";
import Link from "next/link";
import { Button } from "./ui/button";
import { UpdateEventModal } from "./UpdateEventModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

export function EventCard({ event }: { event: Event }) {
  const { mutate: deleteEvent } = useDeleteEvent();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    setIsDeleteDialogOpen(false);
  };


  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 group relative">
      {/* Delete button in top right corner - visible on hover */}
      <div className="flex gap-4 flex-col absolute top-2 right-2">
        <UpdateEventModal event={event} />
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className=" opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteEvent}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
            <Heart className="h-6 w-6 text-rose-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{event.eventName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Updated {event.updatedAt ? new Date(event.updatedAt).toLocaleDateString("no-NO") : "no date"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar className="mr-2 h-4 w-4" />
          {event.eventDate ? new Date(event.eventDate).toLocaleDateString("no-NO") : "no date"}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MapPin className="mr-2 h-4 w-4" />
          {event.venueAddress?.street ?? "no address"}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Users className="mr-2 h-4 w-4" />
          {12} guests
        </div>
      </div>

      <Link href={`/protected/event/${event.id}`} className="block">
        <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 group-hover:scale-[1.02] transition-all duration-200">
          Open Event
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>

    </Card>
  );
}

