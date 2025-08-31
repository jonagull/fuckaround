import React, { useState } from "react";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { EventType, IRequestCreateEvent, useCreateEvent } from "weddingplanner-shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogTitle, DialogTrigger, DialogContent } from "./ui/dialog";
import { AddressSearch } from "./AddressSearch";

export function CreateEventModal() {

  const { mutate: createEvent } = useCreateEvent();

  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<IRequestCreateEvent>({
    eventName: "",
    eventDate: null,
    venueAddress: null,
    type: EventType.WEDDING,
    eventDescription: null,
  });

  const handleCreateEvent = () => {
    createEvent({
      eventName: formData.eventName,
      eventDescription: formData.eventDescription,
      type: formData.type,
      eventDate: formData.eventDate,
      venueAddress: formData.venueAddress,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">Create New Event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Create New Event
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
                value={formData.eventDate ? formData.eventDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setFormData({ ...formData, eventDate: new Date(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as EventType })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EventType.WEDDING}>Wedding</SelectItem>
                  <SelectItem value={EventType.BIRTHDAY}>Birthday</SelectItem>
                  <SelectItem value={EventType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="venueAddress">Venue Address</Label>
              <AddressSearch
                value={formData.venueAddress}
                onChange={(address) => setFormData({ ...formData, venueAddress: address })}
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
            <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600" onClick={handleCreateEvent}>
              Create Event
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
