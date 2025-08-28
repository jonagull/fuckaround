"use client";

import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { OnboardingStep } from "./steps/OnboardingStep";
import { GuestListStep } from "./steps/GuestListStep";
import { InvitationStep } from "./steps/InvitationStep";
import { RSVPManagementStep } from "./steps/RSVPManagementStep";
import { TablePlanningStep } from "./steps/TablePlanningStep";
import { OverviewStep } from "./steps/OverviewStep";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export interface WeddingData {
    // Onboarding data
    weddingDate: string;
    partnerOneName: string;
    partnerTwoName: string;
    guestEstimate: number;
    theme: string;
    venue: string;

    // Guest data
    guests: Guest[];

    // Invitation data
    invitationTemplate: string;
    weddingDetails: {
        time: string;
        venue: string;
        dressCode: string;
        additionalInfo: string;
    };

    // RSVP data
    rsvpDeadline: string;
    mealOptions: string[];

    // Table planning data
    tables: Table[];
}

export interface Guest {
    id: string;
    name: string;
    email: string;
    phone?: string;
    group: "family" | "friends" | "work" | "other";
    allowPlusOne: boolean;
    rsvpStatus: "pending" | "confirmed" | "declined";
    plusOneName?: string;
    mealChoice?: string;
    dietaryRestrictions?: string;
    tableId?: string;
}

export interface Table {
    id: string;
    name: string;
    capacity: number;
    guests: Guest[];
}

const STEPS = [
    {
        id: 1,
        title: "Wedding Details",
        description: "Basic information about your wedding",
    },
    { id: 2, title: "Guest List", description: "Add and organize your guests" },
    { id: 3, title: "Invitations", description: "Design and send invitations" },
    { id: 4, title: "RSVP Tracking", description: "Monitor responses" },
    { id: 5, title: "Table Planning", description: "Arrange seating" },
    { id: 6, title: "Final Overview", description: "Review and export" },
];

export default function WeddingWizardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [weddingData, setWeddingData] = useState<WeddingData>({
        weddingDate: "",
        partnerOneName: "",
        partnerTwoName: "",
        guestEstimate: 50,
        theme: "",
        venue: "",
        guests: [],
        invitationTemplate: "classic",
        weddingDetails: {
            time: "",
            venue: "",
            dressCode: "",
            additionalInfo: "",
        },
        rsvpDeadline: "",
        mealOptions: ["Beef", "Chicken", "Fish", "Vegetarian"],
        tables: [],
    });

    const updateWeddingData = (updates: Partial<WeddingData>) => {
        setWeddingData((prev) => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 1 && step <= STEPS.length) {
            setCurrentStep(step);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <OnboardingStep
                        data={weddingData}
                        updateData={updateWeddingData}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <GuestListStep
                        data={weddingData}
                        updateData={updateWeddingData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 3:
                return (
                    <InvitationStep
                        data={weddingData}
                        updateData={updateWeddingData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 4:
                return (
                    <RSVPManagementStep
                        data={weddingData}
                        updateData={updateWeddingData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 5:
                return (
                    <TablePlanningStep
                        data={weddingData}
                        updateData={updateWeddingData}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                );
            case 6:
                return (
                    <OverviewStep
                        data={weddingData}
                        updateData={updateWeddingData}
                        onPrev={prevStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 relative">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
                fixed lg:static inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
            >
                <Sidebar
                    currentStep={currentStep}
                    steps={STEPS}
                    onStepClick={goToStep}
                    weddingData={weddingData}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {/* Mobile Menu Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            <div className="min-w-0">
                                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                    {
                                        STEPS.find((s) => s.id === currentStep)
                                            ?.title
                                    }
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm lg:text-base hidden sm:block">
                                    {
                                        STEPS.find((s) => s.id === currentStep)
                                            ?.description
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-3">
                            <Badge
                                variant="secondary"
                                className="px-2 lg:px-3 py-1 text-xs lg:text-sm"
                            >
                                {currentStep}/{STEPS.length}
                            </Badge>
                            <div className="w-16 lg:w-32 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            (currentStep / STEPS.length) * 100
                                        }%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 lg:p-6">
                    <div className="max-w-5xl mx-auto">
                        {renderCurrentStep()}
                    </div>
                </div>
            </div>
        </div>
    );
}
