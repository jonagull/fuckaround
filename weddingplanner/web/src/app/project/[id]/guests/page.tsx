import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Mail, Phone } from "lucide-react";
import { CsvImportModal } from "@/components/guests/CsvImportModal";

const guests = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "Confirmed",
    plusOne: true,
    table: "Table 1",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "+1 (555) 234-5678",
    status: "Pending",
    plusOne: false,
    table: "Table 2",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "m.brown@email.com",
    phone: "+1 (555) 345-6789",
    status: "Declined",
    plusOne: true,
    table: null,
  },
];

export default function ProjectGuestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Guest List</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage guests for Sarah & John&apos;s Wedding and track RSVPs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CsvImportModal projectId={params.id} />
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">248</p>
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
              <p className="text-2xl font-bold text-green-600">186</p>
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
              <p className="text-2xl font-bold text-yellow-600">45</p>
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
              <p className="text-2xl font-bold text-red-600">17</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search guests..." className="pl-10" />
      </div>

      {/* Guest List */}
      <div className="space-y-4">
        {guests.map((guest) => (
          <Card key={guest.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {guest.name}
                  </h3>
                  <Badge
                    variant="secondary"
                    className={
                      guest.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : guest.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {guest.status}
                  </Badge>
                  {guest.plusOne && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      +1
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Mail className="mr-1 h-4 w-4" />
                    {guest.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="mr-1 h-4 w-4" />
                    {guest.phone}
                  </div>
                  {guest.table && (
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {guest.table}
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
          </Card>
        ))}
      </div>
    </div>
  );
}
