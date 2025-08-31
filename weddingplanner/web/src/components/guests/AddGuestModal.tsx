"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvitationForm } from "@/components/invitations/InvitationForm";
import { Plus } from "lucide-react";

interface AddGuestModalProps {
  eventId: string;
}

export function AddGuestModal({ eventId }: AddGuestModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Guest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Guest</DialogTitle>
        </DialogHeader>
        <InvitationForm eventId={eventId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
