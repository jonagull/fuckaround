"use client";

import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    UserCheck,
    Plus,
    Phone,
    Mail,
    MapPin,
    DollarSign,
    Calendar,
    Star,
    Edit,
    Trash2,
} from "lucide-react";

interface Vendor {
    id: string;
    name: string;
    category: string;
    contact: {
        phone: string;
        email: string;
        website?: string;
        address?: string;
    };
    pricing: {
        quote: number;
        deposit: number;
        finalPayment: number;
        depositPaid: boolean;
        finalPaid: boolean;
    };
    status: "researching" | "contacted" | "quoted" | "booked" | "confirmed";
    rating: number;
    notes: string;
    contractDate?: string;
    serviceDate: string;
}

const VENDOR_CATEGORIES = [
    "Venue",
    "Catering",
    "Photography",
    "Videography",
    "Music/DJ",
    "Florist",
    "Wedding Planner",
    "Transportation",
    "Cake/Desserts",
    "Hair & Makeup",
    "Officiant",
    "Other",
];

export default function VendorManagerPage() {
    const [vendors, setVendors] = useState<Vendor[]>([
        {
            id: "1",
            name: "Elegant Gardens Venue",
            category: "Venue",
            contact: {
                phone: "(555) 123-4567",
                email: "info@elegantgardens.com",
                website: "www.elegantgardens.com",
                address: "123 Wedding Lane, City, ST 12345",
            },
            pricing: {
                quote: 8000,
                deposit: 2000,
                finalPayment: 6000,
                depositPaid: true,
                finalPaid: false,
            },
            status: "booked",
            rating: 5,
            notes: "Beautiful outdoor ceremony space with indoor reception hall. Includes tables, chairs, and basic lighting.",
            contractDate: "2024-01-15",
            serviceDate: "2024-08-15",
        },
        {
            id: "2",
            name: "Capture Moments Photography",
            category: "Photography",
            contact: {
                phone: "(555) 987-6543",
                email: "hello@capturemoments.com",
                website: "www.capturemoments.com",
            },
            pricing: {
                quote: 3500,
                deposit: 1000,
                finalPayment: 2500,
                depositPaid: false,
                finalPaid: false,
            },
            status: "quoted",
            rating: 4,
            notes: "Highly recommended by venue. Specializes in outdoor weddings. Package includes 8 hours coverage and online gallery.",
            serviceDate: "2024-08-15",
        },
        {
            id: "3",
            name: "Sweet Celebrations Catering",
            category: "Catering",
            contact: {
                phone: "(555) 456-7890",
                email: "events@sweetcelebrations.com",
            },
            pricing: {
                quote: 4500,
                deposit: 1500,
                finalPayment: 3000,
                depositPaid: false,
                finalPaid: false,
            },
            status: "contacted",
            rating: 0,
            notes: "Waiting for tasting appointment. Menu includes appetizers, main course, and dessert for 100 guests.",
            serviceDate: "2024-08-15",
        },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
    const [newVendor, setNewVendor] = useState({
        name: "",
        category: VENDOR_CATEGORIES[0],
        phone: "",
        email: "",
        website: "",
        address: "",
        quote: 0,
        serviceDate: "",
        notes: "",
    });

    const addVendor = () => {
        if (!newVendor.name || !newVendor.email) return;

        const vendor: Vendor = {
            id: Date.now().toString(),
            name: newVendor.name,
            category: newVendor.category,
            contact: {
                phone: newVendor.phone,
                email: newVendor.email,
                website: newVendor.website,
                address: newVendor.address,
            },
            pricing: {
                quote: newVendor.quote,
                deposit: Math.round(newVendor.quote * 0.3), // Default 30% deposit
                finalPayment: Math.round(newVendor.quote * 0.7),
                depositPaid: false,
                finalPaid: false,
            },
            status: "researching",
            rating: 0,
            notes: newVendor.notes,
            serviceDate: newVendor.serviceDate,
        };

        setVendors([...vendors, vendor]);
        setNewVendor({
            name: "",
            category: VENDOR_CATEGORIES[0],
            phone: "",
            email: "",
            website: "",
            address: "",
            quote: 0,
            serviceDate: "",
            notes: "",
        });
        setShowAddForm(false);
    };

    const updateVendorStatus = (id: string, status: Vendor["status"]) => {
        setVendors(
            vendors.map((vendor) =>
                vendor.id === id ? { ...vendor, status } : vendor
            )
        );
    };

    const updatePaymentStatus = (
        id: string,
        type: "deposit" | "final",
        paid: boolean
    ) => {
        setVendors(
            vendors.map((vendor) =>
                vendor.id === id
                    ? {
                          ...vendor,
                          pricing: {
                              ...vendor.pricing,
                              [type === "deposit"
                                  ? "depositPaid"
                                  : "finalPaid"]: paid,
                          },
                      }
                    : vendor
            )
        );
    };

    const deleteVendor = (id: string) => {
        setVendors(vendors.filter((vendor) => vendor.id !== id));
    };

    const getStatusColor = (status: Vendor["status"]) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "booked":
                return "bg-blue-100 text-blue-800";
            case "quoted":
                return "bg-yellow-100 text-yellow-800";
            case "contacted":
                return "bg-purple-100 text-purple-800";
            case "researching":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const totalBudget = vendors.reduce(
        (sum, vendor) => sum + vendor.pricing.quote,
        0
    );
    const totalPaid = vendors.reduce((sum, vendor) => {
        return (
            sum +
            (vendor.pricing.depositPaid ? vendor.pricing.deposit : 0) +
            (vendor.pricing.finalPaid ? vendor.pricing.finalPayment : 0)
        );
    }, 0);
    const bookedVendors = vendors.filter(
        (v) => v.status === "booked" || v.status === "confirmed"
    ).length;

    const vendorsByCategory = VENDOR_CATEGORIES.map((category) => ({
        category,
        vendors: vendors.filter((vendor) => vendor.category === category),
    })).filter((group) => group.vendors.length > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Vendor Manager
                    </h1>
                    <p className="text-gray-600">
                        Track and manage all your wedding vendors
                    </p>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Vendors
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {vendors.length}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div>
                            <p className="text-sm text-gray-600">Booked</p>
                            <p className="text-2xl font-bold text-green-600">
                                {bookedVendors}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Budget
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                ${totalBudget.toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div>
                            <p className="text-sm text-gray-600">Paid</p>
                            <p className="text-2xl font-bold text-purple-600">
                                ${totalPaid.toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Vendor Button */}
            <div className="flex justify-end">
                <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Vendor
                </Button>
            </div>

            {/* Add Vendor Form */}
            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Vendor</CardTitle>
                        <CardDescription>
                            Add a new wedding vendor to track
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Vendor Name</Label>
                                <Input
                                    id="name"
                                    value={newVendor.name}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            name: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., ABC Photography"
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={newVendor.category}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    {VENDOR_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newVendor.email}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            email: e.target.value,
                                        })
                                    }
                                    placeholder="vendor@example.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={newVendor.phone}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            phone: e.target.value,
                                        })
                                    }
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                            <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={newVendor.website}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            website: e.target.value,
                                        })
                                    }
                                    placeholder="www.vendor.com"
                                />
                            </div>
                            <div>
                                <Label htmlFor="quote">Quote Amount</Label>
                                <Input
                                    id="quote"
                                    type="number"
                                    value={newVendor.quote}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            quote:
                                                parseInt(e.target.value) || 0,
                                        })
                                    }
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <Label htmlFor="serviceDate">
                                    Service Date
                                </Label>
                                <Input
                                    id="serviceDate"
                                    type="date"
                                    value={newVendor.serviceDate}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            serviceDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={newVendor.address}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            address: e.target.value,
                                        })
                                    }
                                    placeholder="123 Main St, City, ST"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={newVendor.notes}
                                    onChange={(e) =>
                                        setNewVendor({
                                            ...newVendor,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Additional notes about this vendor"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={addVendor}>Add Vendor</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Vendors by Category */}
            <div className="space-y-6">
                {vendorsByCategory.map((group) => (
                    <Card key={group.category}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{group.category}</span>
                                <Badge variant="secondary">
                                    {group.vendors.length} vendor
                                    {group.vendors.length !== 1 ? "s" : ""}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {group.vendors.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        className="border border-gray-200 rounded-lg p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {vendor.name}
                                                </h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge
                                                        className={getStatusColor(
                                                            vendor.status
                                                        )}
                                                    >
                                                        {vendor.status}
                                                    </Badge>
                                                    {vendor.rating > 0 && (
                                                        <div className="flex items-center">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${
                                                                            i <
                                                                            vendor.rating
                                                                                ? "text-yellow-400 fill-current"
                                                                                : "text-gray-300"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={vendor.status}
                                                    onChange={(e) =>
                                                        updateVendorStatus(
                                                            vendor.id,
                                                            e.target
                                                                .value as Vendor["status"]
                                                        )
                                                    }
                                                    className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
                                                >
                                                    <option value="researching">
                                                        Researching
                                                    </option>
                                                    <option value="contacted">
                                                        Contacted
                                                    </option>
                                                    <option value="quoted">
                                                        Quoted
                                                    </option>
                                                    <option value="booked">
                                                        Booked
                                                    </option>
                                                    <option value="confirmed">
                                                        Confirmed
                                                    </option>
                                                </select>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteVendor(vendor.id)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Contact Info */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Contact Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    {vendor.contact.phone && (
                                                        <div className="flex items-center space-x-2">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>
                                                                {
                                                                    vendor
                                                                        .contact
                                                                        .phone
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.contact.email && (
                                                        <div className="flex items-center space-x-2">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            <span>
                                                                {
                                                                    vendor
                                                                        .contact
                                                                        .email
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.contact.website && (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-blue-600 hover:underline cursor-pointer">
                                                                {
                                                                    vendor
                                                                        .contact
                                                                        .website
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.contact.address && (
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <span className="text-xs">
                                                                {
                                                                    vendor
                                                                        .contact
                                                                        .address
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Pricing */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Pricing & Payments
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span>
                                                            Total Quote:
                                                        </span>
                                                        <span className="font-semibold">
                                                            $
                                                            {vendor.pricing.quote.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>Deposit:</span>
                                                        <div className="flex items-center space-x-2">
                                                            <span>
                                                                $
                                                                {vendor.pricing.deposit.toLocaleString()}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    vendor
                                                                        .pricing
                                                                        .depositPaid
                                                                }
                                                                onChange={(e) =>
                                                                    updatePaymentStatus(
                                                                        vendor.id,
                                                                        "deposit",
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                                className="text-green-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span>
                                                            Final Payment:
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <span>
                                                                $
                                                                {vendor.pricing.finalPayment.toLocaleString()}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    vendor
                                                                        .pricing
                                                                        .finalPaid
                                                                }
                                                                onChange={(e) =>
                                                                    updatePaymentStatus(
                                                                        vendor.id,
                                                                        "final",
                                                                        e.target
                                                                            .checked
                                                                    )
                                                                }
                                                                className="text-green-500"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Info */}
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">
                                                    Additional Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    {vendor.serviceDate && (
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span>
                                                                Service:{" "}
                                                                {new Date(
                                                                    vendor.serviceDate
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.contractDate && (
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <span>
                                                                Contract:{" "}
                                                                {new Date(
                                                                    vendor.contractDate
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {vendor.notes && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                                {vendor.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
