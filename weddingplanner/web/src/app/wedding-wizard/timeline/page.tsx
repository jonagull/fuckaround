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
    Calendar,
    Plus,
    Check,
    Clock,
    AlertTriangle,
    User,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    dueDate: string;
    assignedTo: string;
    priority: "high" | "medium" | "low";
    status: "completed" | "in-progress" | "pending";
    timeframe: string; // e.g., "12 months before", "1 week before"
}

const TASK_CATEGORIES = [
    "Planning & Organization",
    "Venue & Catering",
    "Guest Management",
    "Attire & Beauty",
    "Photography & Music",
    "Legal & Documentation",
    "Final Preparations",
];

const TIMEFRAMES = [
    "12+ months before",
    "9-12 months before",
    "6-9 months before",
    "3-6 months before",
    "2-3 months before",
    "1 month before",
    "1 week before",
    "Day of wedding",
    "After wedding",
];

export default function TimelineTasksPage() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            title: "Set wedding budget",
            description:
                "Determine overall budget and allocate to different categories",
            category: "Planning & Organization",
            dueDate: "2024-02-15",
            assignedTo: "Both",
            priority: "high",
            status: "completed",
            timeframe: "12+ months before",
        },
        {
            id: "2",
            title: "Book wedding venue",
            description: "Research and book ceremony and reception venues",
            category: "Venue & Catering",
            dueDate: "2024-03-01",
            assignedTo: "Both",
            priority: "high",
            status: "in-progress",
            timeframe: "9-12 months before",
        },
        {
            id: "3",
            title: "Send save the dates",
            description: "Design and send save the date cards to guests",
            category: "Guest Management",
            dueDate: "2024-04-15",
            assignedTo: "Partner 1",
            priority: "medium",
            status: "pending",
            timeframe: "6-9 months before",
        },
        {
            id: "4",
            title: "Book photographer",
            description: "Research and hire wedding photographer",
            category: "Photography & Music",
            dueDate: "2024-03-15",
            assignedTo: "Partner 2",
            priority: "high",
            status: "pending",
            timeframe: "9-12 months before",
        },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        category: TASK_CATEGORIES[0],
        dueDate: "",
        assignedTo: "Both",
        priority: "medium" as Task["priority"],
        timeframe: TIMEFRAMES[0],
    });

    const addTask = () => {
        if (!newTask.title || !newTask.dueDate) return;

        const task: Task = {
            id: Date.now().toString(),
            title: newTask.title,
            description: newTask.description,
            category: newTask.category,
            dueDate: newTask.dueDate,
            assignedTo: newTask.assignedTo,
            priority: newTask.priority,
            status: "pending",
            timeframe: newTask.timeframe,
        };

        setTasks([...tasks, task]);
        setNewTask({
            title: "",
            description: "",
            category: TASK_CATEGORIES[0],
            dueDate: "",
            assignedTo: "Both",
            priority: "medium",
            timeframe: TIMEFRAMES[0],
        });
        setShowAddForm(false);
    };

    const updateTaskStatus = (id: string, status: Task["status"]) => {
        setTasks(
            tasks.map((task) => (task.id === id ? { ...task, status } : task))
        );
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const getStatusColor = (status: Task["status"]) => {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "in-progress":
                return "bg-blue-500";
            case "pending":
                return "bg-gray-400";
            default:
                return "bg-gray-400";
        }
    };

    const getPriorityColor = (priority: Task["priority"]) => {
        switch (priority) {
            case "high":
                return "text-red-600 bg-red-100";
            case "medium":
                return "text-yellow-600 bg-yellow-100";
            case "low":
                return "text-green-600 bg-green-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const totalTasks = tasks.length;
    const overdueTasks = tasks.filter(
        (t) => t.status !== "completed" && new Date(t.dueDate) < new Date()
    ).length;

    const tasksByTimeframe = TIMEFRAMES.map((timeframe) => ({
        timeframe,
        tasks: tasks.filter((task) => task.timeframe === timeframe),
    })).filter((group) => group.tasks.length > 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Timeline & Tasks
                    </h1>
                    <p className="text-gray-600">
                        Stay organized with your wedding planning timeline
                    </p>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Progress
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {completedTasks}/{totalTasks}
                                </p>
                            </div>
                            <div className="w-16 h-16 relative">
                                <svg
                                    className="w-16 h-16 transform -rotate-90"
                                    viewBox="0 0 36 36"
                                >
                                    <path
                                        className="text-gray-200"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className="text-blue-500"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray={`${
                                            (completedTasks / totalTasks) * 100
                                        }, 100`}
                                        strokeLinecap="round"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {Math.round(
                                            (completedTasks / totalTasks) * 100
                                        )}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    In Progress
                                </p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {
                                        tasks.filter(
                                            (t) => t.status === "in-progress"
                                        ).length
                                    }
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {overdueTasks}
                                </p>
                            </div>
                            {overdueTasks > 0 && (
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Task Button */}
            <div className="flex justify-end">
                <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </Button>
            </div>

            {/* Add Task Form */}
            {showAddForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Task</CardTitle>
                        <CardDescription>
                            Create a new wedding planning task
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="title">Task Title</Label>
                                <Input
                                    id="title"
                                    value={newTask.title}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Book wedding venue"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    value={newTask.description}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Additional details about the task"
                                />
                            </div>
                            <div>
                                <Label htmlFor="category">Category</Label>
                                <select
                                    id="category"
                                    value={newTask.category}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    {TASK_CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="timeframe">Timeframe</Label>
                                <select
                                    id="timeframe"
                                    value={newTask.timeframe}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            timeframe: e.target.value,
                                        })
                                    }
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    {TIMEFRAMES.map((tf) => (
                                        <option key={tf} value={tf}>
                                            {tf}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={newTask.dueDate}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            dueDate: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="assignedTo">Assigned To</Label>
                                <select
                                    id="assignedTo"
                                    value={newTask.assignedTo}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            assignedTo: e.target.value,
                                        })
                                    }
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="Both">Both Partners</option>
                                    <option value="Partner 1">Partner 1</option>
                                    <option value="Partner 2">Partner 2</option>
                                    <option value="Family">Family</option>
                                    <option value="Wedding Planner">
                                        Wedding Planner
                                    </option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="priority">Priority</Label>
                                <select
                                    id="priority"
                                    value={newTask.priority}
                                    onChange={(e) =>
                                        setNewTask({
                                            ...newTask,
                                            priority: e.target
                                                .value as Task["priority"],
                                        })
                                    }
                                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                                >
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={addTask}>Add Task</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Timeline View */}
            <div className="space-y-6">
                {tasksByTimeframe.map((group) => (
                    <Card key={group.timeframe}>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                <span>{group.timeframe}</span>
                                <Badge variant="secondary">
                                    {group.tasks.length} tasks
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {group.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
                                    >
                                        <div
                                            className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(
                                                task.status
                                            )}`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {task.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {task.description}
                                                    </p>
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {task.category}
                                                        </Badge>
                                                        <Badge
                                                            className={`text-xs ${getPriorityColor(
                                                                task.priority
                                                            )}`}
                                                        >
                                                            {task.priority}{" "}
                                                            priority
                                                        </Badge>
                                                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                                                            <User className="w-3 h-3" />
                                                            <span>
                                                                {
                                                                    task.assignedTo
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Due:{" "}
                                                            {new Date(
                                                                task.dueDate
                                                            ).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) =>
                                                            updateTaskStatus(
                                                                task.id,
                                                                e.target
                                                                    .value as Task["status"]
                                                            )
                                                        }
                                                        className="text-xs px-2 py-1 border border-gray-300 rounded bg-white text-gray-900"
                                                    >
                                                        <option value="pending">
                                                            Pending
                                                        </option>
                                                        <option value="in-progress">
                                                            In Progress
                                                        </option>
                                                        <option value="completed">
                                                            Completed
                                                        </option>
                                                    </select>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteTask(task.id)
                                                        }
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </Button>
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
