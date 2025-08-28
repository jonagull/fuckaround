"use client";

import { useState } from "react";

interface Guest {
    id: string;
    name: string;
    email: string;
    rsvpStatus: "confirmed" | "pending" | "declined";
    tableId?: string;
}

interface Table {
    id: string;
    name: string;
    capacity: number;
    guests: Guest[];
}

export default function TablePlanningPage() {
    const [guests, setGuests] = useState<Guest[]>([
        {
            id: "1",
            name: "John Smith",
            email: "john@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "2",
            name: "Jane Doe",
            email: "jane@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "3",
            name: "Mike Johnson",
            email: "mike@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "4",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "5",
            name: "David Brown",
            email: "david@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "6",
            name: "Emily Davis",
            email: "emily@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "7",
            name: "Chris Lee",
            email: "chris@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "8",
            name: "Lisa Garcia",
            email: "lisa@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "9",
            name: "Tom Anderson",
            email: "tom@example.com",
            rsvpStatus: "confirmed",
        },
        {
            id: "10",
            name: "Amy Martinez",
            email: "amy@example.com",
            rsvpStatus: "confirmed",
        },
    ]);

    const [tables, setTables] = useState<Table[]>([
        { id: "table-1", name: "Table 1", capacity: 6, guests: [] },
        { id: "table-2", name: "Table 2", capacity: 6, guests: [] },
        { id: "table-3", name: "Table 3", capacity: 4, guests: [] },
        { id: "table-4", name: "Table 4", capacity: 4, guests: [] },
    ]);

    const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);
    const [searchQueries, setSearchQueries] = useState<{
        [key: string]: string;
    }>({});
    const [showDropdowns, setShowDropdowns] = useState<{
        [key: string]: boolean;
    }>({});

    const handleDragStart = (e: React.DragEvent, guest: Guest) => {
        setDraggedGuest(guest);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, tableId: string) => {
        e.preventDefault();
        if (!draggedGuest) return;

        // Remove guest from current table
        const updatedTables = tables.map((table) => ({
            ...table,
            guests: table.guests.filter(
                (guest) => guest.id !== draggedGuest.id
            ),
        }));

        // Add guest to new table
        const targetTable = updatedTables.find((table) => table.id === tableId);
        if (targetTable && targetTable.guests.length < targetTable.capacity) {
            const guestWithTable = { ...draggedGuest, tableId };
            const updatedTablesWithGuest = updatedTables.map((table) =>
                table.id === tableId
                    ? { ...table, guests: [...table.guests, guestWithTable] }
                    : table
            );
            setTables(updatedTablesWithGuest);

            // Update the guest's tableId in the main guests array
            setGuests((prevGuests) =>
                prevGuests.map((g) =>
                    g.id === draggedGuest.id ? { ...g, tableId } : g
                )
            );
        }

        setDraggedGuest(null);
    };

    const removeGuestFromTable = (guestId: string, tableId: string) => {
        const updatedTables = tables.map((table) =>
            table.id === tableId
                ? {
                      ...table,
                      guests: table.guests.filter(
                          (guest) => guest.id !== guestId
                      ),
                  }
                : table
        );
        setTables(updatedTables);

        // Remove the tableId from the guest in the main guests array
        setGuests((prevGuests) =>
            prevGuests.map((g) =>
                g.id === guestId ? { ...g, tableId: undefined } : g
            )
        );
    };

    const addGuestToTable = (guest: Guest, tableId: string) => {
        const targetTable = tables.find((table) => table.id === tableId);
        if (targetTable && targetTable.guests.length < targetTable.capacity) {
            // Remove guest from any existing table first
            const updatedTables = tables.map((table) => ({
                ...table,
                guests: table.guests.filter((g) => g.id !== guest.id),
            }));

            // Add guest to new table
            const guestWithTable = { ...guest, tableId };
            const finalTables = updatedTables.map((table) =>
                table.id === tableId
                    ? { ...table, guests: [...table.guests, guestWithTable] }
                    : table
            );
            setTables(finalTables);

            // Update the guest's tableId in the main guests array
            setGuests((prevGuests) =>
                prevGuests.map((g) =>
                    g.id === guest.id ? { ...g, tableId } : g
                )
            );

            // Clear search and hide dropdown
            setSearchQueries((prev) => ({ ...prev, [tableId]: "" }));
            setShowDropdowns((prev) => ({ ...prev, [tableId]: false }));
        }
    };

    const handleSearchChange = (tableId: string, query: string) => {
        setSearchQueries((prev) => ({ ...prev, [tableId]: query }));
        setShowDropdowns((prev) => ({ ...prev, [tableId]: query.length > 0 }));
    };

    const getFilteredGuests = (tableId: string) => {
        const query = searchQueries[tableId] || "";
        return unassignedGuests.filter(
            (guest) =>
                guest.name.toLowerCase().includes(query.toLowerCase()) ||
                guest.email.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleClickOutside = () => {
        setShowDropdowns({});
    };

    const unassignedGuests = guests.filter((guest) => !guest.tableId);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6"
            onClick={handleClickOutside}
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Table Planning
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Drag and drop guests to arrange seating
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Guest List */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                                Unassigned Guests ({unassignedGuests.length})
                            </h2>
                            <div className="space-y-3">
                                {unassignedGuests.map((guest) => (
                                    <div
                                        key={guest.id}
                                        draggable
                                        onDragStart={(e) =>
                                            handleDragStart(e, guest)
                                        }
                                        className="bg-gradient-to-r from-rose-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl cursor-move hover:shadow-md transition-all duration-200 border border-rose-200 dark:border-gray-600"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {guest.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {guest.email}
                                                </p>
                                            </div>
                                            <div
                                                className={`w-3 h-3 rounded-full ${
                                                    guest.rsvpStatus ===
                                                    "confirmed"
                                                        ? "bg-green-500"
                                                        : guest.rsvpStatus ===
                                                          "pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tables.map((table) => (
                                <div
                                    key={table.id}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, table.id)}
                                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-500 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {table.name}
                                        </h3>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            {table.guests.length}/
                                            {table.capacity}
                                        </span>
                                    </div>

                                    {/* Search Input */}
                                    {table.guests.length < table.capacity && (
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                placeholder="Search guests to add..."
                                                value={
                                                    searchQueries[table.id] ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleSearchChange(
                                                        table.id,
                                                        e.target.value
                                                    )
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                            />

                                            {/* Dropdown */}
                                            {showDropdowns[table.id] &&
                                                getFilteredGuests(table.id)
                                                    .length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                        {getFilteredGuests(
                                                            table.id
                                                        ).map((guest) => (
                                                            <button
                                                                key={guest.id}
                                                                onClick={() =>
                                                                    addGuestToTable(
                                                                        guest,
                                                                        table.id
                                                                    )
                                                                }
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                                            {
                                                                                guest.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                            {
                                                                                guest.email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={`w-3 h-3 rounded-full ${
                                                                            guest.rsvpStatus ===
                                                                            "confirmed"
                                                                                ? "bg-green-500"
                                                                                : guest.rsvpStatus ===
                                                                                  "pending"
                                                                                ? "bg-yellow-500"
                                                                                : "bg-red-500"
                                                                        }`}
                                                                    />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {table.guests.map((guest) => (
                                            <div
                                                key={guest.id}
                                                draggable
                                                onDragStart={(e) =>
                                                    handleDragStart(e, guest)
                                                }
                                                className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-3 rounded-lg flex items-center justify-between cursor-move hover:shadow-md transition-all duration-200"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {guest.name}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                        {guest.email}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeGuestFromTable(
                                                            guest.id,
                                                            table.id
                                                        );
                                                    }}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}

                                        {table.guests.length <
                                            table.capacity && (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                                                Drop guests here
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                        Seating Summary
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                                {guests.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Total Guests
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {
                                    guests.filter(
                                        (g) => g.rsvpStatus === "confirmed"
                                    ).length
                                }
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Confirmed
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {tables.reduce(
                                    (acc, table) => acc + table.guests.length,
                                    0
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Seated
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {tables.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Tables
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
