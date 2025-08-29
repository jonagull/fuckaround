import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStepStatus } from "../utils/progress";
import {
    Heart,
    Users,
    Mail,
    CheckSquare,
    TableProperties,
    FileText,
    Home,
    Settings,
    HelpCircle,
    Check,
    Clock,
    ArrowRight,
    X,
    DollarSign,
    Calendar,
    UserCheck,
    Globe,
    Music,
    Camera,
    Car,
    Church,
    Utensils,
    Gift,
} from "lucide-react";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: "completed" | "current" | "pending";
}

interface SidebarProps {
    currentStep?: number;
    steps?: Array<{
        id: number;
        title: string;
        description: string;
    }>;
    onStepClick?: (step: number) => void;
    weddingData?: {
        partnerOneName: string;
        partnerTwoName: string;
        guests: any[];
    };
    onClose?: () => void;
}

export default function Sidebar({
    currentStep,
    steps,
    onStepClick,
    weddingData,
    onClose,
}: SidebarProps) {
    // Use the imported getStepStatus function
    const getStepStatusForSidebar = (stepId: number) =>
        getStepStatus(stepId, currentStep);

    // Force re-render when localStorage changes (for progress updates)
    const [, forceUpdate] = useState({});

    useEffect(() => {
        const handleStorageChange = () => {
            forceUpdate({});
        };

        window.addEventListener("storage", handleStorageChange);
        // Also listen for custom events when localStorage is updated from same tab
        window.addEventListener(
            "wedding-progress-updated",
            handleStorageChange
        );

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener(
                "wedding-progress-updated",
                handleStorageChange
            );
        };
    }, []);

    const sidebarSteps: Step[] = [
        {
            id: 1,
            title: "Wedding Details",
            description: "Basic information",
            icon: <Heart className="w-4 h-4" />,
            status: getStepStatusForSidebar(1),
        },
        {
            id: 2,
            title: "Guest List",
            description: "Manage invitees",
            icon: <Users className="w-4 h-4" />,
            status: getStepStatusForSidebar(2),
        },
        {
            id: 3,
            title: "Invitations",
            description: "Design & send",
            icon: <Mail className="w-4 h-4" />,
            status: getStepStatusForSidebar(3),
        },
        {
            id: 4,
            title: "RSVP Tracking",
            description: "Monitor responses",
            icon: <CheckSquare className="w-4 h-4" />,
            status: getStepStatusForSidebar(4),
        },
        {
            id: 5,
            title: "Table Planning",
            description: "Arrange seating",
            icon: <TableProperties className="w-4 h-4" />,
            status: getStepStatusForSidebar(5),
        },
        {
            id: 6,
            title: "Final Overview",
            description: "Review & export",
            icon: <FileText className="w-4 h-4" />,
            status: getStepStatusForSidebar(6),
        },
    ];

    const progress =
        currentStep && steps
            ? ((currentStep - 1) / (steps.length - 1)) * 100
            : 0;

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm lg:text-base">
                                W
                            </span>
                        </div>
                        <div>
                            <h1 className="text-base lg:text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                Wedding Planner
                            </h1>
                            <p className="text-xs text-gray-500">
                                Plan your perfect day
                            </p>
                        </div>
                    </div>
                    {/* Mobile Close Button */}
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="lg:hidden"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                {/* Couple Names */}
                {weddingData &&
                    (weddingData.partnerOneName ||
                        weddingData.partnerTwoName) && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-1">
                                Planning for:
                            </p>
                            <p className="font-medium text-gray-900">
                                {weddingData.partnerOneName} &{" "}
                                {weddingData.partnerTwoName}
                            </p>
                        </div>
                    )}

                {/* Progress - only show if we have wizard data */}
                {currentStep && steps && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Steps */}
            <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {/* Planning Steps - always show */}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Planning Steps
                </h3>
                {sidebarSteps.map((step) => (
                    <button
                        key={step.id}
                        onClick={() => {
                            if (onStepClick) {
                                onStepClick(step.id);
                            } else {
                                // Navigate to main wizard with step parameter
                                window.location.href = `/wedding-wizard?step=${step.id}`;
                            }
                            onClose?.(); // Close mobile sidebar when step is clicked
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left group touch-manipulation ${
                            step.status === "current"
                                ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 shadow-sm"
                                : step.status === "completed"
                                ? "bg-rose-50/50 border border-rose-200/50 hover:bg-rose-100/50"
                                : "hover:bg-slate-50 border border-transparent"
                        }`}
                    >
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                step.status === "current"
                                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                    : step.status === "completed"
                                    ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white"
                                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                            }`}
                        >
                            {step.status === "completed" ? (
                                <Check className="w-4 h-4" />
                            ) : step.status === "current" ? (
                                step.icon
                            ) : (
                                step.icon
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p
                                className={`text-sm font-medium ${
                                    step.status === "current"
                                        ? "text-rose-700"
                                        : step.status === "completed"
                                        ? "text-rose-600"
                                        : "text-slate-700"
                                }`}
                            >
                                {step.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {step.description}
                            </p>
                        </div>
                        {step.status === "current" && (
                            <ArrowRight className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                        {step.status === "pending" && (
                            <Clock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        )}
                    </button>
                ))}

                {/* Additional Wedding Tools */}
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 mt-6">
                    Wedding Tools
                </h3>
                <div className="space-y-1">
                    {[
                        {
                            icon: <DollarSign className="w-4 h-4" />,
                            title: "Budget Tracker",
                            description: "Manage expenses",
                        },
                        {
                            icon: <Calendar className="w-4 h-4" />,
                            title: "Timeline & Tasks",
                            description: "Stay organized",
                        },
                        {
                            icon: <UserCheck className="w-4 h-4" />,
                            title: "Vendor Manager",
                            description: "Track vendors",
                        },
                        {
                            icon: <Globe className="w-4 h-4" />,
                            title: "Wedding Website",
                            description: "Share details",
                        },
                        {
                            icon: <Utensils className="w-4 h-4" />,
                            title: "Catering Menu",
                            description: "Plan meals",
                        },
                        {
                            icon: <Music className="w-4 h-4" />,
                            title: "Music & DJ",
                            description: "Playlist & timing",
                        },
                        {
                            icon: <Camera className="w-4 h-4" />,
                            title: "Photography",
                            description: "Shot lists",
                        },
                        {
                            icon: <Car className="w-4 h-4" />,
                            title: "Transportation",
                            description: "Guest logistics",
                        },
                        {
                            icon: <Church className="w-4 h-4" />,
                            title: "Ceremony Details",
                            description: "Vows & traditions",
                        },
                        {
                            icon: <Gift className="w-4 h-4" />,
                            title: "Gift Registry",
                            description: "Manage gifts",
                        },
                    ].map((tool, index) => (
                        <button
                            key={tool.title}
                            onClick={() => {
                                // Navigate to tool page
                                const routes: { [key: string]: string } = {
                                    "Budget Tracker": "/wedding-wizard/budget",
                                    "Timeline & Tasks":
                                        "/wedding-wizard/timeline",
                                    "Vendor Manager": "/wedding-wizard/vendors",
                                    "Wedding Website":
                                        "/wedding-wizard/website",
                                    "Catering Menu": "/wedding-wizard/catering",
                                    "Music & DJ": "/wedding-wizard/music",
                                    Photography: "/wedding-wizard/photography",
                                    Transportation:
                                        "/wedding-wizard/transportation",
                                    "Ceremony Details":
                                        "/wedding-wizard/ceremony",
                                    "Gift Registry": "/wedding-wizard/registry",
                                };

                                const route = routes[tool.title];
                                if (route) {
                                    window.location.href = route;
                                }
                                onClose?.();
                            }}
                            className="w-full flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200 text-left group touch-manipulation hover:bg-slate-50 border border-transparent hover:border-slate-200"
                        >
                            <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-600 group-hover:bg-slate-200">
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-800">
                                    {tool.title}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {tool.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Stats - only show if we have wedding data */}
            {weddingData && weddingData.guests && (
                <div className="p-4 border-t border-gray-200 space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <Card className="p-3 text-center">
                            <div className="text-lg font-bold text-gray-900">
                                {weddingData.guests.length}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total Guests
                            </div>
                        </Card>
                        <Card className="p-3 text-center">
                            <div className="text-lg font-bold text-emerald-600">
                                {
                                    weddingData.guests.filter(
                                        (g) => g.rsvpStatus === "confirmed"
                                    ).length
                                }
                            </div>
                            <div className="text-xs text-gray-500">
                                Confirmed
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                        window.location.href = "/wedding-wizard";
                        onClose?.();
                    }}
                >
                    <Home className="w-4 h-4 mr-2" />
                    Dashboard
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help
                </Button>
            </div>
        </div>
    );
}
