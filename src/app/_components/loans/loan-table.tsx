'use client';

import React from "react";
import { DataTable, type Column } from "~/app/_components/ui/data-table";
import { Currency } from "~/app/_components/ui/currency";
import { getStatusDisplay } from "~/utils/loan";
import type { LoanStatus } from "~/utils/loan";
import { formatDate } from "~/utils/date";
import { User, Ban } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/app/_components/ui/table";
import { Skeleton } from "~/app/_components/ui/skeleton";

interface LoanTableProps {
    userType: "lender" | "borrower";
}

interface Loan {
    id: number;
    amount: number;
    currency: string;
    status: LoanStatus;
    startDate: string | null;
    duration: number;
    preferredSchedule: string;
    lenderId: string;
    borrowerId: string;
}

interface User {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: { emailAddress: string }[];
}

function LoadingState() {
    return (
        <div className="rounded-xl bg-muted/50">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Borrower</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Schedule</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-primary/10 p-1">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                    </div>
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function LoanTable({ userType }: LoanTableProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loans, setLoans] = React.useState<Loan[]>([]);
    const [users, setUsers] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sortKey, setSortKey] = React.useState<keyof Loan>(searchParams.get("sort") as keyof Loan || "startDate");
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(searchParams.get("order") as "asc" | "desc" || "desc");

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/loans/${userType}?${searchParams.toString()}`);
            const data = await response.json();
            setLoans(data.loans);
            setUsers(data.users);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        }
        setIsLoading(false);
    }, [searchParams, userType]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const getUserName = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.emailAddresses[0]?.emailAddress ?? "Unknown User";
    };

    const handleSort = (key: keyof Loan) => {
        const newOrder = key === sortKey && sortOrder === "desc" ? "asc" : "desc";
        setSortKey(key);
        setSortOrder(newOrder);

        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", key);
        params.set("order", newOrder);
        router.push(`?${params.toString()}`);
    };

    const columns = React.useMemo<Column<Loan>[]>(() => [
        {
            key: "amount",
            header: "Amount",
            cell: (_: unknown, row: Loan) => (
                <Link href={`/loans/${row.id}`} className="block hover:underline">
                    <Currency amount={row.amount} currency={row.currency} />
                </Link>
            ),
            sortable: true,
        },
        {
            key: "borrowerId",
            header: userType === "lender" ? "Borrower" : "Lender",
            cell: (_: unknown, row: Loan) => (
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                        <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="truncate">
                        {getUserName(userType === "lender" ? row.borrowerId : row.lenderId)}
                    </span>
                </div>
            ),
        },
        {
            key: "status",
            header: "Status",
            cell: (_: unknown, row: Loan) => getStatusDisplay(row.status),
            sortable: true,
        },
        {
            key: "startDate",
            header: "Start Date",
            cell: (_: unknown, row: Loan) => row.startDate ? formatDate(row.startDate) : "Not started",
            sortable: true,
        },
        {
            key: "duration",
            header: "Duration",
            cell: (_: unknown, row: Loan) => `${row.duration} months`,
            sortable: true,
        },
        {
            key: "preferredSchedule",
            header: "Schedule",
            cell: (_: unknown, row: Loan) => row.preferredSchedule.toLowerCase(),
            sortable: true,
        },
    ], [userType, getUserName]);

    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <DataTable
            data={loans}
            columns={columns}
            onSort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
            emptyState={{
                icon: Ban,
                title: "No loans found",
                description: "There are no loans to display at the moment."
            }}
            className="rounded-xl bg-muted/50"
        />
    );
} 