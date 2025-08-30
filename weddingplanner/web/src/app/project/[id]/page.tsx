import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Heart,
  TableProperties,
  Mail,
  Camera,
} from "lucide-react";

export default function ProjectDashboard({ params }: { params: { id: string } }) {
  const projectId = params.id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sarah & John's Wedding
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Project Overview • June 15, 2024 • Grand Ballroom, Downtown
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge className="bg-green-100 text-green-700">Active</Badge>
          <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
            <Camera className="mr-2 h-4 w-4" />
            Add Photos
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Guests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">150</p>
              <p className="text-xs text-green-600">127 confirmed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Days Left</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
              <p className="text-xs text-gray-600">Until the big day</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tasks Done</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24/32</p>
              <p className="text-xs text-purple-600">75% complete</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <span className="text-rose-600 font-bold text-lg">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$28k</p>
              <p className="text-xs text-gray-600">of $35k total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Planning Progress
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">75%</span>
            </div>
            <Progress value={75} className="h-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Venue & Catering</span>
                <span className="text-sm text-green-600">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Photography</span>
                <span className="text-sm text-green-600">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Guest Management</span>
                <span className="text-sm text-blue-600">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Decorations</span>
                <span className="text-sm text-yellow-600">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Send RSVP Reminders
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TableProperties className="mr-2 h-4 w-4" />
              Update Seating Chart
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Vendor Meeting
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Thank You Cards
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Cake Tasting</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tomorrow at 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Final Guest Count</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Due March 20th</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Heart className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">Rehearsal Dinner</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">June 14th at 6:00 PM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* To-Do List */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Tasks</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white line-through">
                Book photographer
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Completed 2 days ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Order wedding favors</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Due in 3 days</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Send save the dates</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">In progress</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
