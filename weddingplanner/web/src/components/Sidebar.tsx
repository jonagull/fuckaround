"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Calendar,
  Users,
  Settings,
  Heart,
  TableProperties,
  ArrowLeft,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLogout, useGetEvent } from "weddingplanner-shared";
import type { Event } from "weddingplanner-shared";

const getNavigation = (projectId?: string) => [
  {
    name: "Overview",
    href: projectId ? `/event/${projectId}` : "#",
    icon: Home,
  },
  {
    name: "Guest List",
    href: projectId ? `/event/${projectId}/guests` : "#",
    icon: Users,
  },
  {
    name: "Table Planning",
    href: projectId ? `/event/${projectId}/table-planning` : "#",
    icon: TableProperties,
  },
  {
    name: "Events & Timeline",
    href: projectId ? `/event/${projectId}/timeline` : "#",
    icon: Calendar,
  },
  {
    name: "Settings",
    href: projectId ? `/event/${projectId}/settings` : "#",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
  event?: Event;
}

export function Sidebar({ className, event }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { mutate: logout } = useLogout();

  // Extract event ID from pathname if we're in an event context
  const eventId = pathname.split("/")[2];
  const isEventContext = eventId && pathname.startsWith("/event/");

  // Fetch event data if we're in an event context and no event was passed as prop
  const { data: fetchedEvent } = useGetEvent(isEventContext ? eventId : "");

  // Use passed event prop or fetched event data
  const currentEvent = event || fetchedEvent;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const projectId = pathname.split("/")[2];
  const navigation = getNavigation(projectId);

  return (
    <div className={cn("flex h-screen", className)}>
      <div
        className={cn(
          "flex h-full flex-col items-center gap-4 border-r bg-background p-2 transition-all duration-300 shrink-0",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex h-[60px] shrink-0 items-center justify-center">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Planio
              </span>
            )}
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border" />

        {/* Content */}
        <div className="flex-1 w-full overflow-y-auto">
          <div className="space-y-2 p-2">
            {/* Project Info */}
            {isEventContext && (
              <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                {!isCollapsed ? (
                  <>
                    <p className="text-xs font-medium text-rose-700 dark:text-rose-300 mb-1">
                      Current Project
                    </p>
                    <p className="text-xs text-rose-600 dark:text-rose-400">
                      {currentEvent?.eventName || "Loading..."}
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            {isEventContext && <div className="w-full h-px bg-border" />}

            {/* Back to Projects */}
            {isEventContext && (
              <div className="space-y-1">
                <Link href="/">
                  <Button
                    variant="outline"
                    size={isCollapsed ? "icon" : "default"}
                    className={cn("w-full", isCollapsed ? "h-8 w-8" : "justify-start")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">All Projects</span>}
                  </Button>
                </Link>
                <Link href="/protected/invitations">
                  <Button
                    variant="outline"
                    size={isCollapsed ? "icon" : "default"}
                    className={cn("w-full", isCollapsed ? "h-8 w-8" : "justify-start")}
                  >
                    <Bell className="h-4 w-4" />
                    {!isCollapsed && <span className="ml-2">Invitations</span>}
                  </Button>
                </Link>
              </div>
            )}

            {/* Divider */}
            {isEventContext && <div className="w-full h-px bg-border" />}

            {/* Navigation */}
            {isEventContext && (
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size={isCollapsed ? "icon" : "default"}
                        className={cn(
                          "w-full",
                          isCollapsed ? "h-8 w-8" : "justify-start",
                          isActive && "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span className="ml-2">{item.name}</span>}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Divider */}
            {isEventContext && <div className="w-full h-px bg-border" />}

            {/* Project Progress */}
            {isEventContext && !isCollapsed && (
              <div className="p-2">
                <h2 className="mb-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Project Progress
                </h2>
                <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Overall Progress
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 h-1.5 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
                    On track for June 15th
                  </p>
                </div>
              </div>
            )}

            {/* Divider */}
            {isEventContext && <div className="w-full h-px bg-border" />}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-2">
          <Button
            variant="outline"
            size={isCollapsed ? "icon" : "default"}
            className={cn(
              "w-full",
              isCollapsed ? "h-8 w-8" : "justify-start",
              "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border" />

        {/* Collapse Toggle */}
        <div className="p-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
