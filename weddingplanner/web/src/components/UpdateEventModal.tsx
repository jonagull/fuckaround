import React, { useState } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Event, RequestUpdateEvent, useUpdateEvent } from "weddingplanner-shared";
import { Dialog, DialogTitle, DialogTrigger, DialogContent } from "./ui/dialog";
import { AddressSearch } from "./AddressSearch";
import { Pencil } from "lucide-react";

interface UpdateEventModalProps {
  event: Event;
}

export function UpdateEventModal({ event }: UpdateEventModalProps) {
  const { mutate: updateEvent } = useUpdateEvent();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<RequestUpdateEvent>({
    eventName: event.eventName,
    eventDate: event.eventDate,
    venueAddress: event.venueAddress ?? undefined,
    eventDescription: event.eventDescription,
  });

  const handleUpdateEvent = () => {
    updateEvent({
      id: event.id, // This should be passed as a prop or context
      event: {
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        eventDate: formData.eventDate,
        venueAddress: formData.venueAddress ?? undefined,
      }
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Update Event
        </DialogTitle>

        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="e.g., Sarah & John's Wedding"
                value={formData.eventName}
                onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                className="mt-1"
                value={formData.eventDate ? new Date(formData.eventDate).toISOString().split("T")[0] : ""}
                onChange={(e) => setFormData({ ...formData, eventDate: new Date(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="venueAddress">Venue Address</Label>
              <AddressSearch
                value={formData.venueAddress}
                onChange={(address) => setFormData({ ...formData, venueAddress: address ?? undefined })}
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="eventDescription">Event Description</Label>
            <Input
              id="eventDescription"
              placeholder="Brief description of your event..."
              value={formData.eventDescription || ""}
              onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="flex items-center space-x-3 mt-6">
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600" onClick={handleUpdateEvent}>
              Update Event
            </Button>
            <Button variant="outline" onClick={() => { setIsOpen(false) }}>
              Cancel
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
