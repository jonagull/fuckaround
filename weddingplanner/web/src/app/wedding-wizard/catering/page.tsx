"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Utensils } from "lucide-react";

export default function CateringMenuPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Catering Menu
                    </h1>
                    <p className="text-gray-600">
                        Plan your wedding menu and manage catering details
                    </p>
                </div>
            </div>

            {/* Coming Soon */}
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>
                        This catering menu planner is under development
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        We're working on a comprehensive catering menu planner
                        that will help you:
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        <li>
                            • Plan your wedding menu with appetizers, mains, and
                            desserts
                        </li>
                        <li>
                            • Manage dietary restrictions and special requests
                        </li>
                        <li>• Calculate portions and costs per guest</li>
                        <li>• Coordinate with catering vendors</li>
                        <li>• Track menu tastings and decisions</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
