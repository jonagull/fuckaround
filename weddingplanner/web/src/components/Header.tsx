"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useMe, useLogout, usePlannerInvitations } from "weddingplanner-shared";
import { useCurrentUser } from "./CurrentUserContext";
import { Bell } from "lucide-react";
import { Badge } from "./ui/badge";

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { mutate: logout } = useLogout();
  const { data: me } = useMe();
  const { setCurrentUser } = useCurrentUser();
  const { data: invitations } = usePlannerInvitations();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pathname]);

  useEffect(() => {
    if (me) setCurrentUser(me);
  }, [me, setCurrentUser]);

  const handleLogoutClick = () => {
    logout();
    router.push("/login");
  };

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) router.push("/protected/dashboard");
    else router.push("/login");
  };

  const pendingInvitationCount = invitations?.received?.length || 0;

  if (isAuthenticated === null) {
    return (
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            WeddingPlanner
          </span>
        </div>
      </Link>
      <div className="flex items-center space-x-4">
        {isAuthenticated && (
          <Link href="/protected/invitations" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {pendingInvitationCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingInvitationCount}
              </span>
            )}
          </Link>
        )}
        <button
          onClick={handleLogoutClick}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isAuthenticated ? "Log out" : "Login"}
        </button>
        <button
          onClick={handleGetStartedClick}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isAuthenticated ? "Dashboard" : "Get Started"}
        </button>
      </div>
    </nav>
  );
};
