"use client";

import { QueryClient, QueryClientProvider, ReactQueryDevtools } from "weddingplanner-shared";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1,
                staleTime: 5 * 60 * 1000, // 5 minutes
                gcTime: 10 * 60 * 1000, // 10 minutes
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />

        </QueryClientProvider>
    );
}