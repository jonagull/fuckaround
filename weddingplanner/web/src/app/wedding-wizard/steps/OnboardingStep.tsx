import { useState } from "react";
import { WeddingDetails as BaseWeddingDetails } from "@weddingplanner/types";
import { useMutation } from "@tanstack/react-query";

// Use the base WeddingDetails type directly
type WeddingDetails = BaseWeddingDetails;
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
import { Heart, Calendar, MapPin, Users, Check } from "lucide-react";
import { markStepCompleted } from "../utils/progress";
import { useWeddingDetails } from "@weddingplanner/frontend-shared/hooks";

interface OnboardingStepProps {
    data: WeddingDetails;
    updateData: (updates: Partial<WeddingDetails>) => void;
    onNext: () => void;
}

export function OnboardingStep({
    data,
    updateData,
    onNext,
}: OnboardingStepProps) {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Direct API call function
    const postWeddingDetailsAPI = async (
        weddingDetails: Omit<WeddingDetails, "id" | "createdAt" | "updatedAt">
    ) => {
        const response = await fetch(
            "http://localhost:3070/api/wedding-details",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(weddingDetails),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to post wedding details: ${response.statusText}`
            );
        }

        return response.json();
    };

    // export default function Dashboard({ userId }: { userId: string }) {
    //   const { data, isLoading, error } = useWeddingDetails(userId);

    //   if (isLoading) return <p>Loading...</p>;
    //   if (error) return <p>Error loading wedding details</p>;

    //   return (
    //     <div>
    //       <h1>{data.partnerOneName} & {data.partnerTwoName}</h1>
    //       <p>Date: {data.weddingDate}</p>
    //       <p>Venue: {data.venue}</p>
    //       <p>Guests: {data.guestEstimate}</p>
    //     </div>
    //   );
    // }

    const validateAndNext = async () => {
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
            try {
                // Post wedding details to backend
                // await postWeddingDetailsMutation.mutateAsync({
                //     userId: "temp-user-id", // TODO: Get actual user ID from auth
                //     partnerOneName: data.partnerOneName,
                //     partnerTwoName: data.partnerTwoName,
                //     weddingDate: data.weddingDate,
                //     venue: data.venue,
                //     guestEstimate: data.guestEstimate,
                // });

                onNext();
            } catch (error) {
                console.error("Failed to save wedding details:", error);
                setErrors({
                    submit: "Failed to save wedding details. Please try again.",
                });
            }
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="text-center pb-6 lg:pb-8">
                <div className="mx-auto w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    Welcome to Your Wedding Journey!
                </CardTitle>
                <CardDescription className="text-base lg:text-lg">
                    Let's start by gathering some basic information about your
                    special day
                </CardDescription>
            </CardHeader>

            <CardContent className="px-4 lg:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                </div>
            </CardContent>

            {/* <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 pt-6 px-4 lg:px-6">
                {errors.submit && (
                    <div className="w-full">
                        <p className="text-red-500 text-sm mb-3">
                            {errors.submit}
                        </p>
                    </div>
                )}
                <Button
                    variant="outline"
                    onClick={() => markStepCompleted(1)}
                    className="w-full sm:w-auto border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Complete
                </Button>
                <Button
                    onClick={validateAndNext}
                    size="lg"
                    disabled={postWeddingDetailsMutation.isPending}
                    className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                    {postWeddingDetailsMutation.isPending
                        ? "Saving..."
                        : "Continue to Guest List"}
                </Button>
            </CardFooter> */}
        </Card>
    );
}
