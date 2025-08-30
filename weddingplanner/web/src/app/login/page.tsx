"use client";
import { useLogin } from "weddingplanner-shared";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
    const { mutate: login, isSuccess, isPending, error } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const router = useRouter();

    useEffect(() => {
        if (isSuccess) router.push("/");
    }, [isSuccess, router]);

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};

        if (!email) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email";
        }

        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            login({ email, password });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`pl-10 ${
                                        formErrors.email ? "border-red-500" : ""
                                    }`}
                                    disabled={isPending}
                                />
                            </div>
                            {formErrors.email && (
                                <p className="text-sm text-red-500">
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className={`pl-10 pr-10 ${
                                        formErrors.password
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    disabled={isPending}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={isPending}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            </div>
                            {formErrors.password && (
                                <p className="text-sm text-red-500">
                                    {formErrors.password}
                                </p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                                {error.message ||
                                    "Login failed. Please try again."}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending ? "Signing in..." : "Sign in"}
                        </Button>

                        <div className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full text-sm"
                                onClick={() => {
                                    setEmail("test@example.com");
                                    setPassword("password123");
                                    setFormErrors({});
                                }}
                                disabled={isPending}
                            >
                                Fill Test Data
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
