"use client";
import { useLogin } from "weddingplanner-shared";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Login() {
    const { mutate: login, isSuccess } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    useEffect(() => {
        if (isSuccess) router.push("/protected/dashboard");

    }, [isSuccess, router]);

    return (
        <div>
            <h1>Login</h1>


            <Input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={() => login({ email, password })}>Login</Button>
        </div>
    );
}       