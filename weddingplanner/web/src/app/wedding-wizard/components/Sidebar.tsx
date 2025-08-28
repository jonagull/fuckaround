import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    status: "completed" | "current" | "pending";
}

interface SidebarProps {
    currentStep: number;
    steps: Array<{
        id: number;
        title: string;
        description: string;
    }>;
    onStepClick: (step: number) => void;
    weddingData: {
        partnerOneName: string;
        partnerTwoName: string;
        guests: any[];
    };
    onClose?: () => void;
}

export function Sidebar({
    currentStep,
    steps,
    onStepClick,
    weddingData,
    onClose,
}: SidebarProps) {
    const getStepStatus = (
        stepId: number
    ): "completed" | "current" | "pending" => {
        if (stepId < currentStep) return "completed";
        if (stepId === currentStep) return "current";
        return "pending";
    };

    const sidebarSteps: Step[] = [
        {
            id: 1,
            title: "Wedding Details",
            description: "Basic information",
            icon: <Heart className="w-4 h-4" />,
            status: getStepStatus(1),
        },
        {
            id: 2,
            title: "Guest List",
            description: "Manage invitees",
            icon: <Users className="w-4 h-4" />,
            status: getStepStatus(2),
        },
        {
            id: 3,
            title: "Invitations",
            description: "Design & send",
            icon: <Mail className="w-4 h-4" />,
            status: getStepStatus(3),
        },
        {
            id: 4,
            title: "RSVP Tracking",
            description: "Monitor responses",
            icon: <CheckSquare className="w-4 h-4" />,
            status: getStepStatus(4),
        },
        {
            id: 5,
            title: "Table Planning",
            description: "Arrange seating",
            icon: <TableProperties className="w-4 h-4" />,
            status: getStepStatus(5),
        },
        {
            id: 6,
            title: "Final Overview",
            description: "Review & export",
            icon: <FileText className="w-4 h-4" />,
            status: getStepStatus(6),
        },
    ];

    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

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
                {(weddingData.partnerOneName || weddingData.partnerTwoName) && (
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

                {/* Progress */}
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
            </div>

            {/* Navigation Steps */}
            <div className="flex-1 p-4 space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Planning Steps
                </h3>
                {sidebarSteps.map((step) => (
                    <button
                        key={step.id}
                        onClick={() => {
                            onStepClick(step.id);
                            onClose?.(); // Close mobile sidebar when step is clicked
                        }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left group touch-manipulation ${
                            step.status === "current"
                                ? "bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 shadow-sm"
                                : step.status === "completed"
                                ? "bg-emerald-50 border border-emerald-200 hover:bg-emerald-100"
                                : "hover:bg-gray-50 border border-transparent"
                        }`}
                    >
                        <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                step.status === "current"
                                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
                                    : step.status === "completed"
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
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
                                        ? "text-emerald-700"
                                        : "text-gray-700"
                                }`}
                            >
                                {step.title}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {step.description}
                            </p>
                        </div>
                        {step.status === "current" && (
                            <ArrowRight className="w-4 h-4 text-rose-500 flex-shrink-0" />
                        )}
                        {step.status === "pending" && (
                            <Clock className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        )}
                    </button>
                ))}
            </div>

            {/* Quick Stats */}
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
                        <div className="text-xs text-gray-500">Confirmed</div>
                    </Card>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
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
