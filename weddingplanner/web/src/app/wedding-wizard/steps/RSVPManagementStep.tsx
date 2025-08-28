import { useState } from "react";
import { WeddingData, Guest } from "../page";

interface RSVPManagementStepProps {
    data: WeddingData;
    updateData: (updates: Partial<WeddingData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function RSVPManagementStep({
    data,
    updateData,
    onNext,
    onPrev,
}: RSVPManagementStepProps) {
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [showMealOptions, setShowMealOptions] = useState(false);
    const [newMealOption, setNewMealOption] = useState("");

    const updateGuestRSVP = (guestId: string, updates: Partial<Guest>) => {
        const updatedGuests = data.guests.map((guest) =>
            guest.id === guestId ? { ...guest, ...updates } : guest
        );
        updateData({ guests: updatedGuests });
    };

    const addMealOption = () => {
        if (
            newMealOption.trim() &&
            !data.mealOptions.includes(newMealOption.trim())
        ) {
            updateData({
                mealOptions: [...data.mealOptions, newMealOption.trim()],
            });
            setNewMealOption("");
        }
    };

    const removeMealOption = (option: string) => {
        updateData({
            mealOptions: data.mealOptions.filter((opt) => opt !== option),
        });
    };

    const filteredGuests = data.guests.filter((guest) => {
        if (filterStatus === "all") return true;
        return guest.rsvpStatus === filterStatus;
    });

    const stats = {
        total: data.guests.length,
        confirmed: data.guests.filter((g) => g.rsvpStatus === "confirmed")
            .length,
        declined: data.guests.filter((g) => g.rsvpStatus === "declined").length,
        pending: data.guests.filter((g) => g.rsvpStatus === "pending").length,
        plusOnes: data.guests.filter(
            (g) => g.rsvpStatus === "confirmed" && g.plusOneName
        ).length,
    };

    const mealCounts = data.mealOptions.reduce((acc, option) => {
        acc[option] = data.guests.filter((g) => g.mealChoice === option).length;
        return acc;
    }, {} as Record<string, number>);

    const dietaryRestrictions = data.guests
        .filter((g) => g.dietaryRestrictions && g.rsvpStatus === "confirmed")
        .map((g) => ({ name: g.name, restrictions: g.dietaryRestrictions }));

    // Simulate some RSVP responses for demo
    const simulateRSVP = () => {
        const updatedGuests = data.guests.map((guest, index) => {
            if (index < 3) {
                return {
                    ...guest,
                    rsvpStatus: "confirmed" as const,
                    mealChoice:
                        data.mealOptions[
                            Math.floor(Math.random() * data.mealOptions.length)
                        ],
                    dietaryRestrictions:
                        Math.random() > 0.7 ? "Vegetarian" : undefined,
                    plusOneName:
                        guest.allowPlusOne && Math.random() > 0.5
                            ? "Plus One Name"
                            : undefined,
                };
            }
            if (index === 4) {
                return { ...guest, rsvpStatus: "declined" as const };
            }
            return guest;
        });
        updateData({ guests: updatedGuests });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        RSVP Management 📝
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Track responses and manage meal preferences
                    </p>
                </div>

                {/* Demo Button */}
                <div className="mb-6 text-center">
                    <button
                        onClick={simulateRSVP}
                        className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-all duration-200"
                    >
                        Simulate RSVP Responses (Demo)
                    </button>
                </div>

                {/* Stats Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.total}
                        </div>
                        <div className="text-sm text-blue-800 dark:text-blue-300">
                            Total Invited
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.confirmed}
                        </div>
                        <div className="text-sm text-green-800 dark:text-green-300">
                            Confirmed
                        </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            {stats.declined}
                        </div>
                        <div className="text-sm text-red-800 dark:text-red-300">
                            Declined
                        </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {stats.pending}
                        </div>
                        <div className="text-sm text-yellow-800 dark:text-yellow-300">
                            Pending
                        </div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.plusOnes}
                        </div>
                        <div className="text-sm text-purple-800 dark:text-purple-300">
                            Plus Ones
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Guest List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Guest Responses
                            </h3>
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Guests</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="declined">Declined</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {filteredGuests.map((guest) => (
                                <div
                                    key={guest.id}
                                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-white">
                                                    {guest.name}
                                                </h4>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        guest.rsvpStatus ===
                                                        "confirmed"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                            : guest.rsvpStatus ===
                                                              "declined"
                                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                                    }`}
                                                >
                                                    {guest.rsvpStatus}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {guest.email}
                                            </p>

                                            {guest.rsvpStatus ===
                                                "confirmed" && (
                                                <div className="mt-2 space-y-1">
                                                    {guest.plusOneName && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            <span className="font-medium">
                                                                Plus One:
                                                            </span>{" "}
                                                            {guest.plusOneName}
                                                        </p>
                                                    )}
                                                    {guest.mealChoice && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            <span className="font-medium">
                                                                Meal:
                                                            </span>{" "}
                                                            {guest.mealChoice}
                                                        </p>
                                                    )}
                                                    {guest.dietaryRestrictions && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                            <span className="font-medium">
                                                                Dietary:
                                                            </span>{" "}
                                                            {
                                                                guest.dietaryRestrictions
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Manual RSVP Update */}
                                        <div className="flex space-x-2">
                                            <select
                                                value={guest.rsvpStatus}
                                                onChange={(e) =>
                                                    updateGuestRSVP(guest.id, {
                                                        rsvpStatus: e.target
                                                            .value as Guest["rsvpStatus"],
                                                    })
                                                }
                                                className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>
                                                <option value="confirmed">
                                                    Confirmed
                                                </option>
                                                <option value="declined">
                                                    Declined
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meal Options & Summary */}
                    <div>
                        <div className="space-y-6">
                            {/* Meal Options */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Meal Options
                                    </h3>
                                    <button
                                        onClick={() =>
                                            setShowMealOptions(!showMealOptions)
                                        }
                                        className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
                                    >
                                        {showMealOptions ? "Done" : "Edit"}
                                    </button>
                                </div>

                                {showMealOptions && (
                                    <div className="mb-4">
                                        <div className="flex space-x-2 mb-2">
                                            <input
                                                type="text"
                                                value={newMealOption}
                                                onChange={(e) =>
                                                    setNewMealOption(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="New meal option"
                                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                            />
                                            <button
                                                onClick={addMealOption}
                                                className="bg-rose-500 text-white px-3 py-2 rounded hover:bg-rose-600 text-sm"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    {data.mealOptions.map((option) => (
                                        <div
                                            key={option}
                                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded"
                                        >
                                            <span className="text-gray-900 dark:text-white">
                                                {option}
                                            </span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {mealCounts[option] || 0}
                                                </span>
                                                {showMealOptions && (
                                                    <button
                                                        onClick={() =>
                                                            removeMealOption(
                                                                option
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Dietary Restrictions */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    Dietary Restrictions
                                </h3>
                                {dietaryRestrictions.length > 0 ? (
                                    <div className="space-y-2">
                                        {dietaryRestrictions.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded"
                                                >
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {item.restrictions}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        No dietary restrictions reported
                                    </p>
                                )}
                            </div>

                            {/* RSVP Deadline */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                    RSVP Deadline
                                </h3>
                                <input
                                    type="date"
                                    value={data.rsvpDeadline}
                                    onChange={(e) =>
                                        updateData({
                                            rsvpDeadline: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={onPrev}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Continue to Table Planning
                    </button>
                </div>
            </div>
        </div>
    );
}
