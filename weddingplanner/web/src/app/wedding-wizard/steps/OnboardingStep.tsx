import { useState } from "react";
import { WeddingData } from "../page";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Calendar, MapPin, Users, Palette } from "lucide-react";

interface OnboardingStepProps {
    data: WeddingData;
    updateData: (updates: Partial<WeddingData>) => void;
    onNext: () => void;
}

export function OnboardingStep({
    data,
    updateData,
    onNext,
}: OnboardingStepProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateAndNext = () => {
        const newErrors: { [key: string]: string } = {};

        if (!data.partnerOneName.trim()) {
            newErrors.partnerOneName = "Partner one name is required";
        }
        if (!data.partnerTwoName.trim()) {
            newErrors.partnerTwoName = "Partner two name is required";
        }
        if (!data.weddingDate) {
            newErrors.weddingDate = "Wedding date is required";
        }
        if (!data.venue.trim()) {
            newErrors.venue = "Venue is required";
        }
        if (data.guestEstimate < 1) {
            newErrors.guestEstimate = "Guest estimate must be at least 1";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            onNext();
        }
    };

    const themes = [
        "Classic & Elegant",
        "Rustic & Natural",
        "Modern & Minimalist",
        "Vintage & Romantic",
        "Beach & Tropical",
        "Garden & Outdoor",
        "Industrial & Urban",
        "Bohemian & Free-spirited",
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <CardHeader className="text-center pb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Welcome to Your Wedding Journey!
                </CardTitle>
                <CardDescription className="text-lg">
                    Let's start by gathering some basic information about your
                    special day
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Partner Names */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="partner1"
                            className="flex items-center gap-2"
                        >
                            <Heart className="w-4 h-4 text-rose-500" />
                            Partner One Name *
                        </Label>
                        <Input
                            id="partner1"
                            type="text"
                            value={data.partnerOneName}
                            onChange={(e) =>
                                updateData({ partnerOneName: e.target.value })
                            }
                            className={`h-11 ${
                                errors.partnerOneName
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }`}
                            placeholder="Enter first partner's name"
                        />
                        {errors.partnerOneName && (
                            <p className="text-red-500 text-sm">
                                {errors.partnerOneName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="partner2"
                            className="flex items-center gap-2"
                        >
                            <Heart className="w-4 h-4 text-rose-500" />
                            Partner Two Name *
                        </Label>
                        <Input
                            id="partner2"
                            type="text"
                            value={data.partnerTwoName}
                            onChange={(e) =>
                                updateData({ partnerTwoName: e.target.value })
                            }
                            className={`h-11 ${
                                errors.partnerTwoName
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }`}
                            placeholder="Enter second partner's name"
                        />
                        {errors.partnerTwoName && (
                            <p className="text-red-500 text-sm">
                                {errors.partnerTwoName}
                            </p>
                        )}
                    </div>

                    {/* Wedding Date */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="wedding-date"
                            className="flex items-center gap-2"
                        >
                            <Calendar className="w-4 h-4 text-rose-500" />
                            Wedding Date *
                        </Label>
                        <Input
                            id="wedding-date"
                            type="date"
                            value={data.weddingDate}
                            onChange={(e) =>
                                updateData({ weddingDate: e.target.value })
                            }
                            className={`h-11 ${
                                errors.weddingDate
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }`}
                        />
                        {errors.weddingDate && (
                            <p className="text-red-500 text-sm">
                                {errors.weddingDate}
                            </p>
                        )}
                    </div>

                    {/* Guest Estimate */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="guest-count"
                            className="flex items-center gap-2"
                        >
                            <Users className="w-4 h-4 text-rose-500" />
                            Expected Number of Guests *
                        </Label>
                        <Input
                            id="guest-count"
                            type="number"
                            min="1"
                            value={data.guestEstimate}
                            onChange={(e) =>
                                updateData({
                                    guestEstimate:
                                        parseInt(e.target.value) || 0,
                                })
                            }
                            className={`h-11 ${
                                errors.guestEstimate
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }`}
                            placeholder="e.g., 50"
                        />
                        {errors.guestEstimate && (
                            <p className="text-red-500 text-sm">
                                {errors.guestEstimate}
                            </p>
                        )}
                    </div>

                    {/* Venue */}
                    <div className="md:col-span-2 space-y-2">
                        <Label
                            htmlFor="venue"
                            className="flex items-center gap-2"
                        >
                            <MapPin className="w-4 h-4 text-rose-500" />
                            Venue *
                        </Label>
                        <Input
                            id="venue"
                            type="text"
                            value={data.venue}
                            onChange={(e) =>
                                updateData({ venue: e.target.value })
                            }
                            className={`h-11 ${
                                errors.venue
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }`}
                            placeholder="Enter your wedding venue"
                        />
                        {errors.venue && (
                            <p className="text-red-500 text-sm">
                                {errors.venue}
                            </p>
                        )}
                    </div>

                    {/* Theme */}
                    <div className="md:col-span-2 space-y-2">
                        <Label
                            htmlFor="theme"
                            className="flex items-center gap-2"
                        >
                            <Palette className="w-4 h-4 text-rose-500" />
                            Wedding Theme (Optional)
                        </Label>
                        <select
                            id="theme"
                            value={data.theme}
                            onChange={(e) =>
                                updateData({ theme: e.target.value })
                            }
                            className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                            <option value="">Select a theme (optional)</option>
                            {themes.map((theme) => (
                                <option key={theme} value={theme}>
                                    {theme}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-end pt-6">
                <Button
                    onClick={validateAndNext}
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Continue to Guest List
                </Button>
            </CardFooter>
        </div>
    );
}
