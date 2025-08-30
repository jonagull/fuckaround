"use client";

import { Sidebar } from "@/components/Sidebar";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="ml-64 flex-1">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
