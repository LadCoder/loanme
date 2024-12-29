'use client';

import React from "react";
import { TableHead, TableHeader, TableRow } from "~/app/_components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface LoanTableHeaderProps {
    userType: "lender" | "borrower";
}

export function LoanTableHeader({ userType }: LoanTableHeaderProps) {
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort");
    const currentOrder = searchParams.get("order");

    const getSortUrl = (field: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const newOrder = currentSort === field && currentOrder === "desc" ? "asc" : "desc";
        params.set("sort", field);
        params.set("order", newOrder);
        return `?${params.toString()}`;
    };

    const SortIcon = ({ field }: { field: string }) => {
        if (currentSort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return currentOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
        ) : (
            <ArrowDown className="h-4 w-4" />
        );
    };

    return (
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px]">
                    <Link href={getSortUrl("amount")} className="flex items-center gap-1 hover:text-primary">
                        Amount
                        <SortIcon field="amount" />
                    </Link>
                </TableHead>
                <TableHead className="w-[200px]">
                    {userType === "lender" ? "Borrower" : "Lender"}
                </TableHead>
                <TableHead className="w-[100px]">
                    <Link href={getSortUrl("status")} className="flex items-center gap-1 hover:text-primary">
                        Status
                        <SortIcon field="status" />
                    </Link>
                </TableHead>
                <TableHead className="w-[120px]">
                    <Link href={getSortUrl("startDate")} className="flex items-center gap-1 hover:text-primary">
                        Start Date
                        <SortIcon field="startDate" />
                    </Link>
                </TableHead>
                <TableHead className="w-[100px]">
                    <Link href={getSortUrl("duration")} className="flex items-center gap-1 hover:text-primary">
                        Duration
                        <SortIcon field="duration" />
                    </Link>
                </TableHead>
                <TableHead className="w-[100px]">
                    <Link href={getSortUrl("preferredSchedule")} className="flex items-center gap-1 hover:text-primary">
                        Schedule
                        <SortIcon field="preferredSchedule" />
                    </Link>
                </TableHead>
            </TableRow>
        </TableHeader>
    );
} 