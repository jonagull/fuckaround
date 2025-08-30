import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Venue Visit - Grand Ballroom",
    date: "March 15, 2024",
    time: "2:00 PM",
    location: "Downtown Grand Ballroom",
    status: "Confirmed",
    type: "Venue Visit",
  },
  {
    id: 2,
    title: "Cake Tasting",
    date: "March 20, 2024",
    time: "10:00 AM",
    location: "Sweet Dreams Bakery",
    status: "Pending",
    type: "Tasting",
  },
  {
    id: 3,
    title: "Dress Fitting",
    date: "March 25, 2024",
    time: "3:00 PM",
    location: "Bridal Boutique",
    status: "Confirmed",
    type: "Fitting",
  },
];

export default function ProjectEventsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Keep track of all your wedding-related appointments and events
          </p>
        </div>
        <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {event.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      event.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {event.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
