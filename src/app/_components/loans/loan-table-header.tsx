'use client';

import React from "react";
import { TableHead, TableHeader, TableRow } from "~/app/_components/ui/table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LoanTableHeaderProps {
    userType: "lender" | "borrower";
}

export function LoanTableHeader({ userType }: LoanTableHeaderProps) {
    const searchParams = useSearchParams();

    const getSortUrl = (field: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentSort = params.get("sort");
        const currentOrder = params.get("order");
        const newOrder = currentSort === field && currentOrder === "desc" ? "asc" : "desc";
        params.set("sort", field);
        params.set("order", newOrder);
        return `?${params.toString()}`;
    };

    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead>
                    <Link href={getSortUrl("amount")} className="flex items-center gap-1 hover:text-primary">
                        Amount
                        <ArrowUpDown className="h-4 w-4" />
                    </Link>
                </TableHead>
                <TableHead>
                    {userType === "lender" ? "Borrower" : "Lender"}
                </TableHead>
                <TableHead>
                    <Link href={getSortUrl("status")} className="flex items-center gap-1 hover:text-primary">
                        Status
                        <ArrowUpDown className="h-4 w-4" />
                    </Link>
                </TableHead>
                <TableHead>
                    <Link href={getSortUrl("startDate")} className="flex items-center gap-1 hover:text-primary">
                        Start Date
                        <ArrowUpDown className="h-4 w-4" />
                    </Link>
                </TableHead>
                <TableHead>
                    <Link href={getSortUrl("duration")} className="flex items-center gap-1 hover:text-primary">
                        Duration
                        <ArrowUpDown className="h-4 w-4" />
                    </Link>
                </TableHead>
                <TableHead>
                    <Link href={getSortUrl("preferredSchedule")} className="flex items-center gap-1 hover:text-primary">
                        Schedule
                        <ArrowUpDown className="h-4 w-4" />
                    </Link>
                </TableHead>
            </TableRow>
        </TableHeader>
    );
} 