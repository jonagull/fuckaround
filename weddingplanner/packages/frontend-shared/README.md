# Wedding Planner - Frontend Shared Package

Shared TypeScript utilities, API functions, and TanStack Query hooks for the wedding planner application.

## 🚀 Quick Start

```typescript
import {
    usePostWeddingDetails,
    weddingDetailsApi,
} from "@weddingplanner/frontend-shared";
```

## 📡 API Functions

### Wedding Details API

```typescript
import { weddingDetailsApi } from "@weddingplanner/frontend-shared";

// Create or update wedding details
const weddingDetails = await weddingDetailsApi.post({
    userId: "user-123",
    partnerOneName: "John",
    partnerTwoName: "Jane",
    weddingDate: "2024-06-15",
    venue: "Beach Resort",
    guestEstimate: 100,
    theme: "Beach & Tropical",
});

// Get wedding details by user ID
const details = await weddingDetailsApi.getByUserId("user-123");
```

## 🪝 TanStack Query Hooks

### Wedding Details Hooks

```typescript
import {
    useWeddingDetails,
    usePostWeddingDetails,
    usePostWeddingDetailsOptimistic,
    useHasWeddingDetails,
    weddingDetailsKeys,
} from "@weddingplanner/frontend-shared";

// Get wedding details (with automatic caching)
const { data, isLoading, error } = useWeddingDetails(userId);

// Create/update wedding details
const postMutation = usePostWeddingDetails();
postMutation.mutate(weddingDetailsData);

// With optimistic updates (instant UI feedback)
const optimisticMutation = usePostWeddingDetailsOptimistic();

// Check if user has wedding details
const { hasWeddingDetails, weddingDetails } = useHasWeddingDetails(userId);

// Query keys for manual cache management
queryClient.invalidateQueries({ queryKey: weddingDetailsKeys.all });
```

## 🔧 Features

### API Layer

-   ✅ Centralized API configuration
-   ✅ Automatic error handling
-   ✅ TypeScript support with shared types
-   ✅ Cookie-based authentication support
-   ✅ Environment-aware base URLs

### TanStack Query Integration

-   ✅ Optimistic updates
-   ✅ Automatic cache management
-   ✅ Query invalidation strategies
-   ✅ Loading and error states
-   ✅ Background refetching
-   ✅ Consistent query keys

### Best Practices

-   ✅ Query key factories for cache management
-   ✅ Proper error boundaries
-   ✅ Type-safe API calls
-   ✅ Optimistic UI updates
-   ✅ Cache invalidation strategies

## 🏗️ Architecture

```
packages/frontend-shared/
├── api/                    # API functions
│   ├── weddingDetails.ts  # Wedding details CRUD
│   └── index.ts           # Exports
├── hooks/                 # TanStack Query hooks
│   ├── useWeddingDetails.ts
│   └── index.ts
└── index.ts              # Main exports
```

## 📝 Usage Examples

### Basic Form Submission

```typescript
function WeddingForm() {
    const postMutation = usePostWeddingDetails();

    const handleSubmit = (data) => {
        postMutation.mutate(data, {
            onSuccess: () => {
                // Navigate to next step
                router.push("/guest-list");
            },
            onError: (error) => {
                // Show error message
                toast.error(error.message);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <button disabled={postMutation.isPending} type="submit">
                {postMutation.isPending ? "Saving..." : "Continue"}
            </button>
        </form>
    );
}
```

### Data Loading with Suspense

```typescript
function WeddingDetailsView({ userId }: { userId: string }) {
    const { data: weddingDetails, isLoading } = useWeddingDetails(userId);

    if (isLoading) return <Spinner />;

    return (
        <div>
            <h1>
                {weddingDetails.partnerOneName} &{" "}
                {weddingDetails.partnerTwoName}
            </h1>
            <p>Date: {weddingDetails.weddingDate}</p>
            <p>Venue: {weddingDetails.venue}</p>
        </div>
    );
}
```

## 🧪 Testing

The hooks are designed to work with TanStack Query's testing utilities:

```typescript
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useWeddingDetails } from "@weddingplanner/frontend-shared";

test("should fetch wedding details", async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    const { result } = renderHook(() => useWeddingDetails("user-123"), {
        wrapper,
    });

    // Test implementation
});
```

## 🔄 Versioning

This package follows semantic versioning. Breaking changes will increment the major version.

## 📦 Dependencies

-   `@tanstack/react-query` - Query and mutation management
-   `@weddingplanner/types` - Shared TypeScript types
-   `react` - React hooks (peer dependency)
