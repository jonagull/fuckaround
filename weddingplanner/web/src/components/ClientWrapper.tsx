"use client";

import { ReactQueryProvider } from "@/lib/providers/query-provider";

interface ClientWrapperProps {
    children: React.ReactNode;
}

export function ClientWrapper({ children }: ClientWrapperProps) {
    return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
