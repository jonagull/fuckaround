import { WeddingData } from "../page";

interface OverviewStepProps {
    data: WeddingData;
    updateData: (updates: Partial<WeddingData>) => void;
    onPrev: () => void;
}

export function OverviewStep({ data, updateData, onPrev }: OverviewStepProps) {
    const confirmedGuests = data.guests.filter(
        (g) => g.rsvpStatus === "confirmed"
    );
    const declinedGuests = data.guests.filter(
        (g) => g.rsvpStatus === "declined"
    );
    const pendingGuests = data.guests.filter((g) => g.rsvpStatus === "pending");
    const seatedGuests = confirmedGuests.filter((g) => g.tableId);
    const unseatedGuests = confirmedGuests.filter((g) => !g.tableId);

    const mealCounts = data.mealOptions.reduce((acc, option) => {
        acc[option] = confirmedGuests.filter(
            (g) => g.mealChoice === option
        ).length;
        return acc;
    }, {} as Record<string, number>);

    const dietaryRestrictions = confirmedGuests
        .filter((g) => g.dietaryRestrictions)
        .map((g) => ({ name: g.name, restrictions: g.dietaryRestrictions }));

    const exportToPDF = () => {
        // In a real app, this would generate a PDF
        const content = generateExportData();
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${data.partnerOneName}-${data.partnerTwoName}-wedding-details.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportToExcel = () => {
        // In a real app, this would generate an Excel file
        alert("Excel export would be generated here!");
    };

    const generateExportData = () => {
        return `
WEDDING DETAILS
===============
Partners: ${data.partnerOneName} & ${data.partnerTwoName}
Date: ${data.weddingDate}
Venue: ${data.venue}
Theme: ${data.theme}
Guest Estimate: ${data.guestEstimate}

GUEST SUMMARY
=============
Total Invited: ${data.guests.length}
Confirmed: ${confirmedGuests.length}
Declined: ${declinedGuests.length}
Pending: ${pendingGuests.length}
Plus Ones: ${confirmedGuests.filter((g) => g.plusOneName).length}

CONFIRMED GUEST LIST
===================
${confirmedGuests
    .map(
        (g) =>
            `${g.name} (${g.email}) - ${g.group}${
                g.plusOneName ? ` +${g.plusOneName}` : ""
            }${g.mealChoice ? ` - ${g.mealChoice}` : ""}${
                g.dietaryRestrictions ? ` - ${g.dietaryRestrictions}` : ""
            }`
    )
    .join("\n")}

MEAL COUNTS
===========
${Object.entries(mealCounts)
    .map(([meal, count]) => `${meal}: ${count}`)
    .join("\n")}

DIETARY RESTRICTIONS
===================
${dietaryRestrictions.map((d) => `${d.name}: ${d.restrictions}`).join("\n")}

TABLE ASSIGNMENTS
================
${data.tables
    .map(
        (table) =>
            `${table.name} (${table.guests.length}/${
                table.capacity
            }):\n${table.guests.map((g) => `  - ${g.name}`).join("\n")}`
    )
    .join("\n\n")}

UNASSIGNED GUESTS
================
${unseatedGuests.map((g) => g.name).join("\n")}
        `.trim();
    };

    const sendToVendors = () => {
        alert("Vendor notifications would be sent here!");
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Wedding Overview & Export 📋
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Review your wedding details and export for vendors
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Wedding Details */}
                    <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Wedding Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Couple:
                                </span>
                                <p className="text-gray-900 dark:text-white">
                                    {data.partnerOneName} &{" "}
                                    {data.partnerTwoName}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Date:
                                </span>
                                <p className="text-gray-900 dark:text-white">
                                    {data.weddingDate
                                        ? new Date(
                                              data.weddingDate
                                          ).toLocaleDateString("en-US", {
                                              weekday: "long",
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                          })
                                        : "Not set"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Time:
                                </span>
                                <p className="text-gray-900 dark:text-white">
                                    {data.weddingDetails.time || "Not set"}
                                </p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    Venue:
                                </span>
                                <p className="text-gray-900 dark:text-white">
                                    {data.venue}
                                </p>
                            </div>
                            {data.theme && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Theme:
                                    </span>
                                    <p className="text-gray-900 dark:text-white">
                                        {data.theme}
                                    </p>
                                </div>
                            )}
                            {data.weddingDetails.dressCode && (
                                <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        Dress Code:
                                    </span>
                                    <p className="text-gray-900 dark:text-white">
                                        {data.weddingDetails.dressCode}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Guest Statistics */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Guest Statistics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Total Invited:
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {data.guests.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Confirmed:
                                </span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                    {confirmedGuests.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Declined:
                                </span>
                                <span className="font-semibold text-red-600 dark:text-red-400">
                                    {declinedGuests.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Pending:
                                </span>
                                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                                    {pendingGuests.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Plus Ones:
                                </span>
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                    {
                                        confirmedGuests.filter(
                                            (g) => g.plusOneName
                                        ).length
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Seated:
                                </span>
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                    {seatedGuests.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 dark:text-gray-300">
                                    Unassigned:
                                </span>
                                <span className="font-semibold text-orange-600 dark:text-orange-400">
                                    {unseatedGuests.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Meal & Dietary Info */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Catering Summary
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Meal Counts:
                                </h4>
                                <div className="space-y-1">
                                    {Object.entries(mealCounts).map(
                                        ([meal, count]) => (
                                            <div
                                                key={meal}
                                                className="flex justify-between text-sm"
                                            >
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {meal}:
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {count}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {dietaryRestrictions.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Dietary Restrictions (
                                        {dietaryRestrictions.length}):
                                    </h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {dietaryRestrictions.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="text-sm"
                                                >
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {item.name}:
                                                    </span>
                                                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                                                        {item.restrictions}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Overview */}
                <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Seating Chart Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.tables.map((table) => (
                            <div
                                key={table.id}
                                className="bg-white dark:bg-gray-600 p-4 rounded-lg"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                        {table.name}
                                    </h4>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {table.guests.length}/{table.capacity}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    {table.guests.map((guest) => (
                                        <div
                                            key={guest.id}
                                            className="text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            {guest.name}
                                            {guest.plusOneName &&
                                                ` (+${guest.plusOneName})`}
                                        </div>
                                    ))}
                                    {table.guests.length === 0 && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                                            No guests assigned
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Export Actions */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Export & Share
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Export for Vendors
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={exportToPDF}
                                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
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
                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <span>Download Summary (TXT)</span>
                                </button>
                                <button
                                    onClick={exportToExcel}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-2"
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
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    <span>Export to Excel</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Notify Vendors
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={sendToVendors}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
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
                                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span>Send to Caterer</span>
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200 flex items-center justify-center space-x-2"
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
                                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                        />
                                    </svg>
                                    <span>Print Overview</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completion Message */}
                <div className="mt-8 text-center bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-2">
                        Congratulations! 🎉
                    </h3>
                    <p className="text-lg mb-4">
                        Your wedding planning is complete! You've successfully
                        organized:
                    </p>
                    <div className="flex justify-center space-x-8 text-sm">
                        <div>✅ Wedding Details</div>
                        <div>✅ Guest List ({data.guests.length})</div>
                        <div>✅ Invitations</div>
                        <div>✅ RSVP Tracking</div>
                        <div>✅ Table Planning</div>
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
                        onClick={() => (window.location.href = "/")}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        Complete Planning
                    </button>
                </div>
            </div>
        </div>
    );
}
