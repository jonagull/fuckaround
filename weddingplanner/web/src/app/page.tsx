"use client";

import React from "react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Heart,
  Plus,
  Calendar,
  Users,
  MapPin,
  MoreHorizontal,
  Search,
  Filter,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Sarah & John's Wedding",
    date: "June 15, 2024",
    location: "Grand Ballroom, Downtown",
    guests: 150,
    progress: 75,
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    lastUpdated: "2 hours ago",
  },
  {
    id: 2,
    title: "Emma & Mike's Big Day",
    date: "August 20, 2024",
    location: "Beach Resort, Malibu",
    guests: 80,
    progress: 45,
    status: "Planning",
    statusColor: "bg-blue-100 text-blue-700",
    lastUpdated: "1 day ago",
  },
  {
    id: 3,
    title: "Lisa & Tom's Celebration",
    date: "October 5, 2024",
    location: "Garden Venue, Napa Valley",
    guests: 200,
    progress: 20,
    status: "Draft",
    statusColor: "bg-yellow-100 text-yellow-700",
    lastUpdated: "3 days ago",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  WeddingPlanner
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Manage all your wedding projects</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

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

        {/* New Project Form */}
        {showNewProjectForm && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Wedding Project
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Couple Names</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Sarah & John's Wedding"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input id="weddingDate" type="date" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="location">Venue/Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Grand Ballroom, Downtown"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="estimatedGuests">Estimated Guests</Label>
                <Input id="estimatedGuests" type="number" placeholder="150" className="mt-1" />
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-6">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                Create Project
              </Button>
              <Button variant="outline" onClick={() => setShowNewProjectForm(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="p-6 hover:shadow-lg transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Updated {project.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={project.statusColor}>
                    {project.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="mr-2 h-4 w-4" />
                  {project.date}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="mr-2 h-4 w-4" />
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Users className="mr-2 h-4 w-4" />
                  {project.guests} guests
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {project.progress}%
                  </span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <Link href={`/project/${project.id}`} className="block">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 group-hover:scale-[1.02] transition-all duration-200">
                  Open Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && searchTerm && (
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
      </div>
    </div>
  );
}
