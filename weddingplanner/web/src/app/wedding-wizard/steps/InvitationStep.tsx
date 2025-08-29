import { useState } from "react";
import { WeddingData, Guest } from "../page";

interface InvitationStepProps {
    data: WeddingData;
    updateData: (updates: Partial<WeddingData>) => void;
    onNext: () => void;
    onPrev: () => void;
}

export function InvitationStep({
    data,
    updateData,
    onNext,
    onPrev,
}: InvitationStepProps) {
    const [previewGuest, setPreviewGuest] = useState<Guest | null>(
        data.guests[0] || null
    );

    const templates = [
        {
            id: "classic",
            name: "Classic Elegance",
            description: "Timeless and sophisticated design",
            preview: "bg-gradient-to-br from-cream-100 to-rose-100",
        },
        {
            id: "modern",
            name: "Modern Minimalist",
            description: "Clean lines and contemporary style",
            preview: "bg-gradient-to-br from-gray-100 to-slate-200",
        },
        {
            id: "romantic",
            name: "Romantic Garden",
            description: "Floral accents and soft colors",
            preview: "bg-gradient-to-br from-pink-100 to-purple-100",
        },
        {
            id: "rustic",
            name: "Rustic Charm",
            description: "Natural textures and earthy tones",
            preview: "bg-gradient-to-br from-amber-100 to-orange-100",
        },
        {
            id: "vintage",
            name: "Vintage Romance",
            description: "Retro styling with classic appeal",
            preview: "bg-gradient-to-br from-yellow-100 to-rose-100",
        },
        {
            id: "beach",
            name: "Beach Bliss",
            description: "Ocean-inspired design",
            preview: "bg-gradient-to-br from-blue-100 to-teal-100",
        },
    ];

    const updateWeddingDetails = (field: string, value: string) => {
        updateData({
            weddingDetails: {
                ...data.weddingDetails,
                [field]: value,
            },
        });
    };

    const generateRSVPLink = (guestId: string) => {
        return `${window.location.origin}/rsvp/${guestId}`;
    };

    const sendInvitations = () => {
        // In a real app, this would trigger email/SMS sending
        alert(`Invitations would be sent to ${data.guests.length} guests!`);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Design Your Invitations 💌
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Choose a template and add your wedding details
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Template Selection & Details */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Choose Template
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() =>
                                        updateData({
                                            invitationTemplate: template.id,
                                        })
                                    }
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                                        data.invitationTemplate === template.id
                                            ? "border-rose-500 bg-rose-50 shadow-sm"
                                            : "border-slate-200 hover:border-slate-300"
                                    }`}
                                >
                                    <div
                                        className={`w-full h-20 rounded mb-2 ${template.preview}`}
                                    ></div>
                                    <h4 className="font-medium text-slate-900 text-sm">
                                        {template.name}
                                    </h4>
                                    <p className="text-xs text-slate-600">
                                        {template.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Wedding Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ceremony Time
                                </label>
                                <input
                                    type="time"
                                    value={data.weddingDetails.time}
                                    onChange={(e) =>
                                        updateWeddingDetails(
                                            "time",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Venue Address
                                </label>
                                <textarea
                                    value={data.weddingDetails.venue}
                                    onChange={(e) =>
                                        updateWeddingDetails(
                                            "venue",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter full venue address"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Dress Code
                                </label>
                                <select
                                    value={data.weddingDetails.dressCode}
                                    onChange={(e) =>
                                        updateWeddingDetails(
                                            "dressCode",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                >
                                    <option value="">Select dress code</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Semi-Formal">
                                        Semi-Formal
                                    </option>
                                    <option value="Formal">Formal</option>
                                    <option value="Black Tie">Black Tie</option>
                                    <option value="White Tie">White Tie</option>
                                    <option value="Cocktail">Cocktail</option>
                                    <option value="Beach Formal">
                                        Beach Formal
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Additional Information
                                </label>
                                <textarea
                                    value={data.weddingDetails.additionalInfo}
                                    onChange={(e) =>
                                        updateWeddingDetails(
                                            "additionalInfo",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Reception details, parking info, special instructions..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Preview
                            </h3>
                            {data.guests.length > 0 && (
                                <select
                                    value={previewGuest?.id || ""}
                                    onChange={(e) => {
                                        const guest = data.guests.find(
                                            (g) => g.id === e.target.value
                                        );
                                        setPreviewGuest(guest || null);
                                    }}
                                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                                >
                                    <option value="">
                                        Select guest for preview
                                    </option>
                                    {data.guests.map((guest) => (
                                        <option key={guest.id} value={guest.id}>
                                            {guest.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
                            {/* Invitation Preview */}
                            <div
                                className={`p-6 rounded-lg ${
                                    templates.find(
                                        (t) => t.id === data.invitationTemplate
                                    )?.preview || "bg-gray-100"
                                }`}
                            >
                                <div className="text-center">
                                    <h1 className="text-2xl font-serif text-gray-800 mb-2">
                                        {data.partnerOneName &&
                                        data.partnerTwoName
                                            ? `${data.partnerOneName} & ${data.partnerTwoName}`
                                            : "Your Names Here"}
                                    </h1>
                                    <p className="text-lg text-gray-700 mb-4">
                                        Request the pleasure of your company
                                    </p>
                                    <div className="border-t border-b border-gray-400 py-4 my-4">
                                        <p className="text-xl font-serif text-gray-800">
                                            {data.weddingDate
                                                ? new Date(
                                                      data.weddingDate
                                                  ).toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          weekday: "long",
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "Wedding Date"}
                                        </p>
                                        {data.weddingDetails.time && (
                                            <p className="text-lg text-gray-700">
                                                at {data.weddingDetails.time}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-gray-700">
                                        <p className="font-medium">
                                            {data.venue || "Venue Name"}
                                        </p>
                                        {data.weddingDetails.venue && (
                                            <p className="text-sm mt-1 whitespace-pre-line">
                                                {data.weddingDetails.venue}
                                            </p>
                                        )}
                                    </div>
                                    {data.weddingDetails.dressCode && (
                                        <p className="text-sm text-gray-600 mt-4">
                                            Dress Code:{" "}
                                            {data.weddingDetails.dressCode}
                                        </p>
                                    )}
                                    {data.weddingDetails.additionalInfo && (
                                        <div className="text-sm text-gray-600 mt-4 whitespace-pre-line">
                                            {data.weddingDetails.additionalInfo}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RSVP Section */}
                            {previewGuest && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Personal RSVP Link for{" "}
                                        {previewGuest.name}:
                                    </h4>
                                    <div className="bg-white p-2 rounded border text-xs font-mono text-gray-600 break-all">
                                        {generateRSVPLink(previewGuest.id)}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Send Options */}
                        <div className="mt-6">
                            <h4 className="font-medium text-slate-900 mb-3">
                                Send Invitations
                            </h4>
                            <div className="space-y-2">
                                <button
                                    onClick={sendInvitations}
                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 shadow-sm transition-all duration-200"
                                >
                                    Send via Email (
                                    {data.guests.filter((g) => g.email).length}{" "}
                                    guests)
                                </button>
                                <button
                                    onClick={() =>
                                        alert("SMS feature coming soon!")
                                    }
                                    className="w-full bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700 shadow-sm transition-all duration-200"
                                >
                                    Send via SMS (
                                    {data.guests.filter((g) => g.phone).length}{" "}
                                    guests)
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-slate-500 text-white py-2 rounded-lg hover:bg-slate-600 shadow-sm transition-all duration-200"
                                >
                                    Print Invitations
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={onPrev}
                        className="px-6 py-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
                    >
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Continue to RSVP Management
                    </button>
                </div>
            </div>
        </div>
    );
}
