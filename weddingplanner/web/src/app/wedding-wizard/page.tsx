"use client";

import { useState } from "react";
import { StepIndicator } from "./components/StepIndicator";
import { OnboardingStep } from "./steps/OnboardingStep";
import { GuestListStep } from "./steps/GuestListStep";
import { InvitationStep } from "./steps/InvitationStep";
import { RSVPManagementStep } from "./steps/RSVPManagementStep";
import { TablePlanningStep } from "./steps/TablePlanningStep";
import { OverviewStep } from "./steps/OverviewStep";
import { Card } from "@/components/ui/card";

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
        <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-pink-50/50">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold">W</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                    Wedding Planner
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Plan your perfect day
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                Step {currentStep} of {STEPS.length}
                            </div>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
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
            </div>

            {/* Step Indicator */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <StepIndicator
                    steps={STEPS}
                    currentStep={currentStep}
                    onStepClick={goToStep}
                />
            </div>

            {/* Step Content */}
            <div className="max-w-7xl mx-auto px-6 pb-12">
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    {renderCurrentStep()}
                </Card>
            </div>
        </div>
    );
}
