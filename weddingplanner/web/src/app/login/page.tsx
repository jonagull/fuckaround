"use client";
import React from "react";
import { useLogin } from "weddingplanner-shared";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/components/CurrentUserContext";

export default function Login() {
    const { mutate: login, isSuccess, data } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setCurrentUser } = useCurrentUser();

    const router = useRouter();

    useEffect(() => {
        if (isSuccess) {
            setCurrentUser(data ?? null);
            router.push("/protected/dashboard");
        }
    }, [isSuccess, router, data, setCurrentUser]);


    const handleLogin = () => login({ email, password });



    return (
        <div>
            <h1>Login</h1>

            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
        </div>
    );
}       