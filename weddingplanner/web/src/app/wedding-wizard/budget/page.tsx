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
    DollarSign,
    Plus,
    Edit,
    Trash2,
    TrendingUp,
    AlertTriangle,
} from "lucide-react";

interface BudgetItem {
    id: string;
    category: string;
    item: string;
    budgeted: number;
    actual: number;
    paid: boolean;
    notes?: string;
}

const BUDGET_CATEGORIES = [
    "Venue & Catering",
    "Photography & Videography",
    "Flowers & Decorations",
    "Music & Entertainment",
    "Attire & Beauty",
    "Transportation",
    "Stationery & Invitations",
    "Rings & Jewelry",
    "Miscellaneous",
];

export default function BudgetTrackerPage() {
    const [totalBudget, setTotalBudget] = useState(25000);
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
        {
            id: "1",
            category: "Venue & Catering",
            item: "Wedding Venue",
            budgeted: 8000,
            actual: 7500,
            paid: true,
            notes: "Includes tables and chairs",
        },
        {
            id: "2",
            category: "Photography & Videography",
            item: "Wedding Photographer",
            budgeted: 3000,
            actual: 0,
            paid: false,
            notes: "8 hours coverage",
        },
        {
            id: "3",
            category: "Flowers & Decorations",
            item: "Bridal Bouquet",
            budgeted: 200,
            actual: 250,
            paid: true,
        },
    ]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        category: BUDGET_CATEGORIES[0],
        item: "",
        budgeted: 0,
        notes: "",
    });

    const addBudgetItem = () => {
        if (!newItem.item || newItem.budgeted <= 0) return;

        const item: BudgetItem = {
            id: Date.now().toString(),
            category: newItem.category,
            item: newItem.item,
            budgeted: newItem.budgeted,
            actual: 0,
            paid: false,
            notes: newItem.notes,
        };

        setBudgetItems([...budgetItems, item]);
        setNewItem({
            category: BUDGET_CATEGORIES[0],
            item: "",
            budgeted: 0,
            notes: "",
        });
        setShowAddForm(false);
    };

    const deleteBudgetItem = (id: string) => {
        setBudgetItems(budgetItems.filter((item) => item.id !== id));
    };

    const updateActualCost = (id: string, actual: number) => {
        setBudgetItems(
            budgetItems.map((item) =>
                item.id === id ? { ...item, actual } : item
            )
        );
    };

    const togglePaid = (id: string) => {
        setBudgetItems(
            budgetItems.map((item) =>
                item.id === id ? { ...item, paid: !item.paid } : item
            )
        );
    };

    const totalBudgeted = budgetItems.reduce(
        (sum, item) => sum + item.budgeted,
        0
    );
    const totalSpent = budgetItems.reduce((sum, item) => sum + item.actual, 0);
    const remaining = totalBudget - totalSpent;
    const overBudget = totalBudgeted > totalBudget;

    const categoryTotals = BUDGET_CATEGORIES.map((category) => {
        const items = budgetItems.filter((item) => item.category === category);
        const budgeted = items.reduce((sum, item) => sum + item.budgeted, 0);
        const actual = items.reduce((sum, item) => sum + item.actual, 0);
        return { category, budgeted, actual, items: items.length };
    }).filter((cat) => cat.budgeted > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Budget Tracker
                    </h1>
                    <p className="text-gray-600">
                        Manage your wedding expenses and stay on track
                    </p>
                </div>
            </div>

            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Budget
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${totalBudget.toLocaleString()}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const newBudget = prompt(
                                        "Enter total budget:",
                                        totalBudget.toString()
                                    );
                                    if (newBudget)
                                        setTotalBudget(parseInt(newBudget));
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Budgeted
                                </p>
                                <p
                                    className={`text-2xl font-bold ${
                                        overBudget
                                            ? "text-red-600"
                                            : "text-blue-600"
                                    }`}
                                >
                                    ${totalBudgeted.toLocaleString()}
                                </p>
                            </div>
                            {overBudget && (
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div>
                            <p className="text-sm text-gray-600">Spent</p>
                            <p className="text-2xl font-bold text-orange-600">
                                ${totalSpent.toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div>
                            <p className="text-sm text-gray-600">Remaining</p>
                            <p
                                className={`text-2xl font-bold ${
                                    remaining < 0
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                ${remaining.toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Category Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Budget by Category</CardTitle>
                    <CardDescription>
                        Overview of spending across different categories
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {categoryTotals.map((cat) => (
                            <div
                                key={cat.category}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {cat.category}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {cat.items} items
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        ${cat.actual.toLocaleString()} / $
                                        {cat.budgeted.toLocaleString()}
                                    </p>
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className={`h-2 rounded-full ${
                                                cat.actual > cat.budgeted
                                                    ? "bg-red-500"
                                                    : "bg-green-500"
                                            }`}
                                            style={{
                                                width: `${Math.min(
                                                    (cat.actual /
                                                        cat.budgeted) *
                                                        100,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Budget Items */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Budget Items</CardTitle>
                        <CardDescription>
                            Detailed breakdown of all wedding expenses
                        </CardDescription>
                    </div>
                    <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Add Item Form */}
                    {showAddForm && (
                        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <h3 className="font-medium text-gray-900 mb-4">
                                Add Budget Item
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={newItem.category}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                category: e.target.value,
                                            })
                                        }
                                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        {BUDGET_CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="item">Item Name</Label>
                                    <Input
                                        id="item"
                                        value={newItem.item}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                item: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Wedding Dress"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="budgeted">
                                        Budgeted Amount
                                    </Label>
                                    <Input
                                        id="budgeted"
                                        type="number"
                                        value={newItem.budgeted}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                budgeted:
                                                    parseInt(e.target.value) ||
                                                    0,
                                            })
                                        }
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notes">
                                        Notes (Optional)
                                    </Label>
                                    <Input
                                        id="notes"
                                        value={newItem.notes}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                notes: e.target.value,
                                            })
                                        }
                                        placeholder="Additional details"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={addBudgetItem}>
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Items List */}
                    <div className="space-y-4">
                        {budgetItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {item.item}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {item.category}
                                            </p>
                                            {item.notes && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.notes}
                                                </p>
                                            )}
                                        </div>
                                        <Badge
                                            variant={
                                                item.paid
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {item.paid ? "Paid" : "Unpaid"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            Budgeted: $
                                            {item.budgeted.toLocaleString()}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-600">
                                                Actual:
                                            </span>
                                            <Input
                                                type="number"
                                                value={item.actual}
                                                onChange={(e) =>
                                                    updateActualCost(
                                                        item.id,
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                className="w-20 h-8 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => togglePaid(item.id)}
                                        >
                                            {item.paid
                                                ? "Mark Unpaid"
                                                : "Mark Paid"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                deleteBudgetItem(item.id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
