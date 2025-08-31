"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  FolderOpen,
  Calendar,
  Users,
  Settings,
  Heart,
  TableProperties,
  ArrowLeft,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const getNavigation = (projectId?: string) => [
  {
    name: "Project Overview",
    href: projectId ? `/project/${projectId}` : "#",
    icon: Home,
  },
  {
    name: "Wedding Wizard",
    href: projectId ? `/project/${projectId}/wedding-wizard` : "#",
    icon: Heart,
  },
  {
    name: "Table Planning",
    href: projectId ? `/project/${projectId}/table-planning` : "#",
    icon: TableProperties,
  },
  {
    name: "Events & Timeline",
    href: projectId ? `/project/${projectId}/events` : "#",
    icon: Calendar,
  },
  {
    name: "Guest List",
    href: projectId ? `/project/${projectId}/guests` : "#",
    icon: Users,
  },
  {
    name: "Settings",
    href: projectId ? `/project/${projectId}/settings` : "#",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  // Extract project ID from the URL
  const projectId = pathname.split("/")[2]; // /project/[id]/...
  const navigation = getNavigation(projectId);

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Logo */}
        <div className="px-3 py-2">
          <Link
            href="/"
            className="flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              WeddingPlanner
            </span>
          </Link>

          {/* Project Info */}
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
            <p className="text-sm font-medium text-rose-700 dark:text-rose-300 mb-1">
              Current Project
            </p>
            <p className="text-sm text-rose-600 dark:text-rose-400">Sarah & John&apos;s Wedding</p>
          </div>

          {/* Back to Projects */}
          <div className="space-y-2">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Projects
              </Button>
            </Link>
            <Link href="/protected/invitations">
              <Button variant="outline" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Invitations
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-rose-50 text-rose-700 hover:bg-rose-100"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Project Progress */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
            Project Progress
          </h2>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">75%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">On track for June 15th</p>
          </div>
        </div>
      </div>
    </div>
  );
}
