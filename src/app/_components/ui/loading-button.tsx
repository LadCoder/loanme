import React from "react";
import { ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface LoadingSortButtonProps {
    field: string;
    children: React.ReactNode;
    className?: string;
}

export function LoadingSortButton({ field, children, className }: LoadingSortButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSort = () => {
        setIsLoading(true);
        const params = new URLSearchParams(searchParams.toString());
        const currentSort = params.get("sort");
        const currentOrder = params.get("order");

        const newOrder = currentSort === field && currentOrder === "desc" ? "asc" : "desc";
        params.set("sort", field);
        params.set("order", newOrder);

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <button
            onClick={handleSort}
            className={cn(
                "flex items-center gap-1 hover:text-primary disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            disabled={isLoading}
        >
            {children}
            <ArrowUpDown className={cn("h-4 w-4", isLoading && "animate-pulse")} />
        </button>
    );
} 