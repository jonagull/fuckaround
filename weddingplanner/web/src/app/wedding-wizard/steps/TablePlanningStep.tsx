import { useState, useEffect } from "react";
import { WeddingData, Guest, Table } from "../page";

interface TablePlanningStepProps {
    data: WeddingData;
    updateData: (updates: Partial<WeddingData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function TablePlanningStep({
    data,
    updateData,
    onNext,
    onPrev,
}: TablePlanningStepProps) {
    const [draggedGuest, setDraggedGuest] = useState<Guest | null>(null);
    const [searchQueries, setSearchQueries] = useState<{
        [key: string]: string;
    }>({});
    const [showDropdowns, setShowDropdowns] = useState<{
        [key: string]: boolean;
    }>({});
    const [showTableForm, setShowTableForm] = useState(false);
    const [newTable, setNewTable] = useState({ name: "", capacity: 6 });

    // Initialize tables if empty
    useEffect(() => {
        if (data.tables.length === 0) {
            const confirmedGuests = data.guests.filter(
                (g) => g.rsvpStatus === "confirmed"
            ).length;
            const estimatedTables = Math.max(1, Math.ceil(confirmedGuests / 6));

            const initialTables: Table[] = Array.from(
                { length: estimatedTables },
                (_, i) => ({
                    id: `table-${i + 1}`,
                    name: `Table ${i + 1}`,
                    capacity: 6,
                    guests: [],
                })
            );

            updateData({ tables: initialTables });
        }
    }, [data.tables, data.guests, updateData]);

    const confirmedGuests = data.guests.filter(
        (g) => g.rsvpStatus === "confirmed"
    );
    const unassignedGuests = confirmedGuests.filter((guest) => !guest.tableId);

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

        const updatedTables = data.tables.map((table) => ({
            ...table,
            guests: table.guests.filter(
                (guest) => guest.id !== draggedGuest.id
            ),
        }));

        const targetTable = updatedTables.find((table) => table.id === tableId);
        if (targetTable && targetTable.guests.length < targetTable.capacity) {
            const guestWithTable = { ...draggedGuest, tableId };
            const updatedTablesWithGuest = updatedTables.map((table) =>
                table.id === tableId
                    ? { ...table, guests: [...table.guests, guestWithTable] }
                    : table
            );
            updateData({ tables: updatedTablesWithGuest });

            const updatedGuests = data.guests.map((g) =>
                g.id === draggedGuest.id ? { ...g, tableId } : g
            );
            updateData({ guests: updatedGuests });
        }

        setDraggedGuest(null);
    };

    const removeGuestFromTable = (guestId: string, tableId: string) => {
        const updatedTables = data.tables.map((table) =>
            table.id === tableId
                ? {
                      ...table,
                      guests: table.guests.filter(
                          (guest) => guest.id !== guestId
                      ),
                  }
                : table
        );
        updateData({ tables: updatedTables });

        const updatedGuests = data.guests.map((g) =>
            g.id === guestId ? { ...g, tableId: undefined } : g
        );
        updateData({ guests: updatedGuests });
    };

    const addGuestToTable = (guest: Guest, tableId: string) => {
        const targetTable = data.tables.find((table) => table.id === tableId);
        if (targetTable && targetTable.guests.length < targetTable.capacity) {
            const updatedTables = data.tables.map((table) => ({
                ...table,
                guests: table.guests.filter((g) => g.id !== guest.id),
            }));

            const guestWithTable = { ...guest, tableId };
            const finalTables = updatedTables.map((table) =>
                table.id === tableId
                    ? { ...table, guests: [...table.guests, guestWithTable] }
                    : table
            );
            updateData({ tables: finalTables });

            const updatedGuests = data.guests.map((g) =>
                g.id === guest.id ? { ...g, tableId } : g
            );
            updateData({ guests: updatedGuests });

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

    const addTable = () => {
        if (!newTable.name.trim()) return;

        const table: Table = {
            id: `table-${Date.now()}`,
            name: newTable.name.trim(),
            capacity: newTable.capacity,
            guests: [],
        };

        updateData({ tables: [...data.tables, table] });
        setNewTable({ name: "", capacity: 6 });
        setShowTableForm(false);
    };

    const removeTable = (tableId: string) => {
        const tableToRemove = data.tables.find((t) => t.id === tableId);
        if (tableToRemove?.guests.length > 0) {
            const updatedGuests = data.guests.map((g) =>
                tableToRemove.guests.some((tg) => tg.id === g.id)
                    ? { ...g, tableId: undefined }
                    : g
            );
            updateData({ guests: updatedGuests });
        }

        const updatedTables = data.tables.filter((t) => t.id !== tableId);
        updateData({ tables: updatedTables });
    };

    const autoAssignTables = () => {
        const availableGuests = [...unassignedGuests];
        const updatedTables = [...data.tables];
        const updatedGuests = [...data.guests];

        // Group guests by their group preference
        const guestsByGroup = availableGuests.reduce((acc, guest) => {
            if (!acc[guest.group]) acc[guest.group] = [];
            acc[guest.group].push(guest);
            return acc;
        }, {} as Record<string, Guest[]>);

        // Try to seat groups together
        let currentTableIndex = 0;
        Object.entries(guestsByGroup).forEach(([group, groupGuests]) => {
            groupGuests.forEach((guest) => {
                let assigned = false;

                // Try to find a table with space
                for (
                    let i = currentTableIndex;
                    i < updatedTables.length && !assigned;
                    i++
                ) {
                    const table = updatedTables[i];
                    if (table.guests.length < table.capacity) {
                        const guestWithTable = { ...guest, tableId: table.id };
                        table.guests.push(guestWithTable);

                        const guestIndex = updatedGuests.findIndex(
                            (g) => g.id === guest.id
                        );
                        if (guestIndex !== -1) {
                            updatedGuests[guestIndex] = {
                                ...updatedGuests[guestIndex],
                                tableId: table.id,
                            };
                        }

                        assigned = true;

                        // Move to next table if this one is full
                        if (table.guests.length >= table.capacity) {
                            currentTableIndex = i + 1;
                        }
                    }
                }
            });
        });

        updateData({ tables: updatedTables, guests: updatedGuests });
    };

    return (
        <div className="max-w-7xl mx-auto" onClick={handleClickOutside}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Table Planning 🪑
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Arrange your confirmed guests at tables
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <button
                        onClick={autoAssignTables}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200"
                    >
                        Auto-Assign Tables
                    </button>
                    <button
                        onClick={() => setShowTableForm(true)}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200"
                    >
                        Add Table
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Unassigned Guests */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                Unassigned Guests ({unassignedGuests.length})
                            </h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {unassignedGuests.map((guest) => (
                                    <div
                                        key={guest.id}
                                        draggable
                                        onDragStart={(e) =>
                                            handleDragStart(e, guest)
                                        }
                                        className="bg-white dark:bg-gray-600 p-3 rounded-lg cursor-move hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-500"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                    {guest.name}
                                                </h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-300">
                                                    {guest.group}
                                                </p>
                                                {guest.mealChoice && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {guest.mealChoice}
                                                    </p>
                                                )}
                                            </div>
                                            {guest.allowPlusOne &&
                                                guest.plusOneName && (
                                                    <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 px-2 py-1 rounded">
                                                        +1
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                ))}
                                {unassignedGuests.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <p>All guests assigned!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tables */}
                    <div className="lg:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.tables.map((table) => (
                                <div
                                    key={table.id}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, table.id)}
                                    className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6 border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-rose-300 dark:hover:border-rose-500 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {table.name}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {table.guests.length}/
                                                {table.capacity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeTable(table.id)
                                                }
                                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
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
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm"
                                            />

                                            {/* Dropdown */}
                                            {showDropdowns[table.id] &&
                                                getFilteredGuests(table.id)
                                                    .length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded shadow-lg max-h-32 overflow-y-auto">
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
                                                                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors text-sm"
                                                            >
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                                        {
                                                                            guest.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                        {
                                                                            guest.group
                                                                        }
                                                                    </p>
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
                                                className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded flex items-center justify-between cursor-move hover:shadow-md transition-all duration-200"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                        {guest.name}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                                                        <span>
                                                            {guest.group}
                                                        </span>
                                                        {guest.mealChoice && (
                                                            <>
                                                                <span>•</span>
                                                                <span>
                                                                    {
                                                                        guest.mealChoice
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
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
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded text-sm">
                                                Drop guests here
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add Table Modal */}
                {showTableForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Add New Table
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Table name"
                                    value={newTable.name}
                                    onChange={(e) =>
                                        setNewTable((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                <input
                                    type="number"
                                    placeholder="Capacity"
                                    min="2"
                                    max="12"
                                    value={newTable.capacity}
                                    onChange={(e) =>
                                        setNewTable((prev) => ({
                                            ...prev,
                                            capacity:
                                                parseInt(e.target.value) || 6,
                                        }))
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    onClick={() => setShowTableForm(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addTable}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Add Table
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Seating Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                {confirmedGuests.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Confirmed Guests
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {data.tables.reduce(
                                    (acc, table) => acc + table.guests.length,
                                    0
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Seated
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {data.tables.length}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Tables
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {data.tables.reduce(
                                    (acc, table) => acc + table.capacity,
                                    0
                                )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Total Seats
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
                        Continue to Overview
                    </button>
                </div>
            </div>
        </div>
    );
}
