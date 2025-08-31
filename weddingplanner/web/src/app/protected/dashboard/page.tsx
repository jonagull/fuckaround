"use client";

import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Plus,
  Calendar,
  Users,
  Search,
  Filter,
  Settings,
  Bell,
} from "lucide-react";
import { useGetEvents, usePlannerInvitations } from "weddingplanner-shared";
import { toast } from "sonner";
import { EventCard } from "@/components/EventCard";
import { CreateEventModal } from "@/components/CreateEventModal";
import PageWrapper from "@/components/PageWrapper";


export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: events } = useGetEvents();
  const { data: invitations } = usePlannerInvitations();

  const pendingInvitationCount = invitations?.received?.length || 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PageWrapper>
        {/* Header */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <CreateEventModal />
          </div>
        </div>

        {/* Pending Invitations Notification */}
        {pendingInvitationCount > 0 && (
          <Card className="p-4 mb-6 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                  <Bell className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    You have {pendingInvitationCount} pending invitation{pendingInvitationCount > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Accept invitations to collaborate on events
                  </p>
                </div>
              </div>
              <a href="/protected/invitations">
                <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                  View Invitations
                </Button>
              </a>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">430</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Upcoming Events
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">%</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">47%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>


        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((project) => (
            <EventCard
              key={project.id}
              event={project}
            />
          ))}
        </div>

        {/* Empty State */}
        {events?.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search terms or create a new project.
            </p>
          </div>
        )}
      </PageWrapper>
    </div>
  );
}
