import { useState } from "react";
import { WeddingData, Guest } from "../page";

interface GuestListStepProps {
    data: WeddingData;
    updateData: (updates: Partial<WeddingData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function GuestListStep({
    data,
    updateData,
    onNext,
    onPrev,
}: GuestListStepProps) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
    const [newGuest, setNewGuest] = useState<Partial<Guest>>({
        name: "",
        email: "",
        phone: "",
        group: "friends",
        allowPlusOne: false,
        rsvpStatus: "pending",
    });
    const [csvText, setCsvText] = useState("");
    const [showCsvImport, setShowCsvImport] = useState(false);
    const [filterGroup, setFilterGroup] = useState<string>("all");

    const generateId = () =>
        `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const addGuest = () => {
        if (!newGuest.name?.trim() || !newGuest.email?.trim()) return;

        const guest: Guest = {
            id: generateId(),
            name: newGuest.name.trim(),
            email: newGuest.email.trim(),
            phone: newGuest.phone?.trim(),
            group: newGuest.group as Guest["group"],
            allowPlusOne: newGuest.allowPlusOne || false,
            rsvpStatus: "pending",
        };

        updateData({ guests: [...data.guests, guest] });
        setNewGuest({
            name: "",
            email: "",
            phone: "",
            group: "friends",
            allowPlusOne: false,
            rsvpStatus: "pending",
        });
        setShowAddForm(false);
    };

    const updateGuest = (updatedGuest: Guest) => {
        const updatedGuests = data.guests.map((g) =>
            g.id === updatedGuest.id ? updatedGuest : g
        );
        updateData({ guests: updatedGuests });
        setEditingGuest(null);
    };

    const deleteGuest = (guestId: string) => {
        const updatedGuests = data.guests.filter((g) => g.id !== guestId);
        updateData({ guests: updatedGuests });
    };

    const importFromCSV = () => {
        const lines = csvText.trim().split("\n");
        const newGuests: Guest[] = [];

        lines.forEach((line, index) => {
            if (index === 0) return; // Skip header
            const [name, email, phone, group, allowPlusOne] = line
                .split(",")
                .map((s) => s.trim());

            if (name && email) {
                newGuests.push({
                    id: generateId(),
                    name,
                    email,
                    phone: phone || undefined,
                    group: (group as Guest["group"]) || "friends",
                    allowPlusOne: allowPlusOne?.toLowerCase() === "true",
                    rsvpStatus: "pending",
                });
            }
        });

        updateData({ guests: [...data.guests, ...newGuests] });
        setCsvText("");
        setShowCsvImport(false);
    };

    const filteredGuests = data.guests.filter(
        (guest) => filterGroup === "all" || guest.group === filterGroup
    );

    const groupCounts = {
        all: data.guests.length,
        family: data.guests.filter((g) => g.group === "family").length,
        friends: data.guests.filter((g) => g.group === "friends").length,
        work: data.guests.filter((g) => g.group === "work").length,
        other: data.guests.filter((g) => g.group === "other").length,
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Guest List Management 👥
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Add your guests and organize them into groups
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200"
                    >
                        Add Guest
                    </button>
                    <button
                        onClick={() => setShowCsvImport(true)}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
                    >
                        Import CSV
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(groupCounts).map(([group, count]) => (
                        <button
                            key={group}
                            onClick={() => setFilterGroup(group)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                filterGroup === group
                                    ? "bg-rose-500 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                            {group === "all"
                                ? "All"
                                : group.charAt(0).toUpperCase() +
                                  group.slice(1)}{" "}
                            ({count})
                        </button>
                    ))}
                </div>

                {/* Guest List */}
                <div className="grid gap-4 mb-8">
                    {filteredGuests.map((guest) => (
                        <div
                            key={guest.id}
                            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between"
                        >
                            <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {guest.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {guest.email}
                                        </p>
                                        {guest.phone && (
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {guest.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                guest.group === "family"
                                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                    : guest.group === "friends"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                                    : guest.group === "work"
                                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                                            }`}
                                        >
                                            {guest.group}
                                        </span>
                                        {guest.allowPlusOne && (
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-xs font-medium">
                                                +1
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setEditingGuest(guest)}
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteGuest(guest.id)}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {data.guests.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p className="text-lg mb-2">No guests added yet</p>
                        <p>
                            Start by adding your first guest or importing from
                            CSV
                        </p>
                    </div>
                )}

                {/* Add Guest Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Add New Guest
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    value={newGuest.name || ""}
                                    onChange={(e) =>
                                        setNewGuest((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    value={newGuest.email || ""}
                                    onChange={(e) =>
                                        setNewGuest((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone (optional)"
                                    value={newGuest.phone || ""}
                                    onChange={(e) =>
                                        setNewGuest((prev) => ({
                                            ...prev,
                                            phone: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <select
                                    value={newGuest.group}
                                    onChange={(e) =>
                                        setNewGuest((prev) => ({
                                            ...prev,
                                            group: e.target
                                                .value as Guest["group"],
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="family">Family</option>
                                    <option value="friends">Friends</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={newGuest.allowPlusOne}
                                        onChange={(e) =>
                                            setNewGuest((prev) => ({
                                                ...prev,
                                                allowPlusOne: e.target.checked,
                                            }))
                                        }
                                        className="text-rose-500 focus:ring-rose-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Allow +1
                                    </span>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addGuest}
                                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                                >
                                    Add Guest
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CSV Import Modal */}
                {showCsvImport && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Import Guests from CSV
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Format: Name, Email, Phone, Group, Allow+1
                                (true/false)
                            </p>
                            <textarea
                                placeholder="John Doe, john@email.com, 123-456-7890, family, true&#10;Jane Smith, jane@email.com, , friends, false"
                                value={csvText}
                                onChange={(e) => setCsvText(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => setShowCsvImport(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={importFromCSV}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    Import
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Guest Modal */}
                {editingGuest && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Edit Guest
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Name *"
                                    value={editingGuest.name}
                                    onChange={(e) =>
                                        setEditingGuest((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      name: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <input
                                    type="email"
                                    placeholder="Email *"
                                    value={editingGuest.email}
                                    onChange={(e) =>
                                        setEditingGuest((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      email: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone (optional)"
                                    value={editingGuest.phone || ""}
                                    onChange={(e) =>
                                        setEditingGuest((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      phone: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <select
                                    value={editingGuest.group}
                                    onChange={(e) =>
                                        setEditingGuest((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      group: e.target
                                                          .value as Guest["group"],
                                                  }
                                                : null
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="family">Family</option>
                                    <option value="friends">Friends</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={editingGuest.allowPlusOne}
                                        onChange={(e) =>
                                            setEditingGuest((prev) =>
                                                prev
                                                    ? {
                                                          ...prev,
                                                          allowPlusOne:
                                                              e.target.checked,
                                                      }
                                                    : null
                                            )
                                        }
                                        className="text-rose-500 focus:ring-rose-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Allow +1
                                    </span>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => setEditingGuest(null)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => updateGuest(editingGuest)}
                                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                        Continue to Invitations
                    </button>
                </div>
            </div>
        </div>
    );
}
