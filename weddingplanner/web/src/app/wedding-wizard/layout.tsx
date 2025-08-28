"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import { Button } from "@/components/ui/button";

export default function WeddingWizardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(true)}
                        className="p-2"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                </div>

                {/* Page content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
