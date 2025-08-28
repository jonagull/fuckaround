import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Step {
    id: number;
    title: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
    onStepClick: (step: number) => void;
}

export function StepIndicator({
    steps,
    currentStep,
    onStepClick,
}: StepIndicatorProps) {
    return (
        <Card className="p-6 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            {/* Desktop view */}
            <div className="hidden md:block">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => onStepClick(step.id)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                                        step.id === currentStep
                                            ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg ring-4 ring-rose-200"
                                            : step.id < currentStep
                                            ? "bg-emerald-500 text-white shadow-md hover:bg-emerald-600"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200 border-2 border-gray-200"
                                    }`}
                                >
                                    {step.id < currentStep ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        step.id
                                    )}
                                </button>
                                <div className="mt-3 text-center max-w-24">
                                    <div
                                        className={`text-sm font-medium ${
                                            step.id === currentStep
                                                ? "text-rose-600"
                                                : step.id < currentStep
                                                ? "text-emerald-600"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.title}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 leading-tight">
                                        {step.description}
                                    </div>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 mx-4 relative">
                                    <div className="h-0.5 bg-gray-200 rounded-full">
                                        <div
                                            className={`h-0.5 rounded-full transition-all duration-500 ${
                                                step.id < currentStep
                                                    ? "bg-gradient-to-r from-emerald-500 to-rose-500 w-full"
                                                    : "w-0"
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
                <div className="flex items-center justify-center space-x-2 mb-4">
                    {steps.map((step) => (
                        <button
                            key={step.id}
                            onClick={() => onStepClick(step.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                                step.id === currentStep
                                    ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white ring-2 ring-rose-200"
                                    : step.id < currentStep
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {step.id < currentStep ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                step.id
                            )}
                        </button>
                    ))}
                </div>
                <div className="text-center">
                    <Badge variant="secondary" className="mb-2">
                        {steps.find((s) => s.id === currentStep)?.title}
                    </Badge>
                    <p className="text-sm text-gray-600">
                        {steps.find((s) => s.id === currentStep)?.description}
                    </p>
                </div>
            </div>
        </Card>
    );
}
